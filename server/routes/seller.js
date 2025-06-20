const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const auth = require("../middleware/auth")
const User = require("../models/User")

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/documents"
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, req.user.id + "-" + req.body.documentType + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const fileFilter = (req, file, cb) => {
  // Allow only specific file types
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"]
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and PDF files are allowed."), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})

// Get seller verification status
router.get("/verification-status", auth, async (req, res) => {
  try {
    if (req.user.userType !== "seller") {
      return res.status(403).json({ message: "Access denied. Seller account required." })
    }

    const user = await User.findById(req.user.id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      verificationStatus: user.sellerProfile?.verificationStatus || "pending",
      documents: user.sellerProfile?.documents || {},
      verified: user.sellerProfile?.verified || false,
      canListProperties: user.sellerProfile?.canListProperties || false,
      verificationNotes: user.sellerProfile?.verificationNotes,
    })
  } catch (error) {
    console.error("Error fetching verification status:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Upload document
router.post("/upload-document", auth, upload.single("document"), async (req, res) => {
  try {
    if (req.user.userType !== "seller") {
      return res.status(403).json({ message: "Access denied. Seller account required." })
    }

    const { documentType } = req.body
    const validDocumentTypes = [
      "identityProof",
      "addressProof",
      "propertyOwnershipProof",
      "taxDocuments",
      "businessLicense",
    ]

    if (!validDocumentTypes.includes(documentType)) {
      return res.status(400).json({ message: "Invalid document type" })
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Initialize sellerProfile if it doesn't exist
    if (!user.sellerProfile) {
      user.sellerProfile = {
        documents: {},
        verificationStatus: "pending",
        verified: false,
        canListProperties: false,
      }
    }

    if (!user.sellerProfile.documents) {
      user.sellerProfile.documents = {}
    }

    // Delete old file if exists
    if (user.sellerProfile.documents[documentType]?.path) {
      const oldFilePath = user.sellerProfile.documents[documentType].path
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath)
      }
    }

    // Save new document info
    user.sellerProfile.documents[documentType] = {
      filename: req.file.originalname,
      path: req.file.path,
      verified: false,
      uploadedAt: new Date(),
      rejectionReason: undefined,
    }

    await user.save()

    res.json({
      message: "Document uploaded successfully",
      document: user.sellerProfile.documents[documentType],
    })
  } catch (error) {
    console.error("Error uploading document:", error)
    res.status(500).json({ message: "Server error during file upload" })
  }
})

// Submit for verification
router.post("/submit-verification", auth, async (req, res) => {
  try {
    if (req.user.userType !== "seller") {
      return res.status(403).json({ message: "Access denied. Seller account required." })
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check if required documents are uploaded
    const requiredDocs = ["identityProof", "addressProof", "propertyOwnershipProof", "taxDocuments"]
    const uploadedDocs = user.sellerProfile?.documents || {}

    const missingDocs = requiredDocs.filter((doc) => !uploadedDocs[doc]?.path)

    if (missingDocs.length > 0) {
      return res.status(400).json({
        message: `Please upload the following required documents: ${missingDocs.join(", ")}`,
        missingDocuments: missingDocs,
      })
    }

    // Update verification status
    if (!user.sellerProfile) {
      user.sellerProfile = {}
    }

    user.sellerProfile.verificationStatus = "under_review"
    await user.save()

    res.json({
      message: "Documents submitted for verification successfully!",
      verificationStatus: "under_review",
    })
  } catch (error) {
    console.error("Error submitting verification:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Admin routes for document verification
router.get("/admin/pending-verifications", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" })
    }

    const pendingSellers = await User.find({
      userType: "seller",
      "sellerProfile.verificationStatus": "under_review",
    }).select("-password")

    res.json({ sellers: pendingSellers })
  } catch (error) {
    console.error("Error fetching pending verifications:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.post("/admin/verify-seller/:sellerId", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" })
    }

    const { sellerId } = req.params
    const { action, notes, documentVerifications } = req.body // action: 'approve' or 'reject'

    const seller = await User.findById(sellerId)
    if (!seller || seller.userType !== "seller") {
      return res.status(404).json({ message: "Seller not found" })
    }

    if (action === "approve") {
      seller.sellerProfile.verificationStatus = "verified"
      seller.sellerProfile.verified = true
      seller.sellerProfile.canListProperties = true
      seller.sellerProfile.verifiedAt = new Date()

      // Mark all documents as verified
      if (documentVerifications) {
        Object.keys(documentVerifications).forEach((docType) => {
          if (seller.sellerProfile.documents[docType]) {
            seller.sellerProfile.documents[docType].verified = documentVerifications[docType].verified
            if (!documentVerifications[docType].verified) {
              seller.sellerProfile.documents[docType].rejectionReason = documentVerifications[docType].reason
            }
          }
        })
      }
    } else if (action === "reject") {
      seller.sellerProfile.verificationStatus = "rejected"
      seller.sellerProfile.verified = false
      seller.sellerProfile.canListProperties = false

      // Mark documents with rejection reasons
      if (documentVerifications) {
        Object.keys(documentVerifications).forEach((docType) => {
          if (seller.sellerProfile.documents[docType]) {
            seller.sellerProfile.documents[docType].verified = false
            seller.sellerProfile.documents[docType].rejectionReason = documentVerifications[docType].reason
          }
        })
      }
    }

    seller.sellerProfile.verificationNotes = notes
    await seller.save()

    res.json({
      message: `Seller ${action === "approve" ? "approved" : "rejected"} successfully`,
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        verificationStatus: seller.sellerProfile.verificationStatus,
      },
    })
  } catch (error) {
    console.error("Error verifying seller:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
