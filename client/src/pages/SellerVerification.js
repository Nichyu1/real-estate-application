"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../styles/SellerVerification.css"

const SellerVerification = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [documents, setDocuments] = useState({})
  const [uploading, setUploading] = useState({})
  const [verificationStatus, setVerificationStatus] = useState("pending")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.userType !== "seller") {
      navigate("/")
      return
    }

    fetchVerificationStatus()
  }, [user, navigate])

  const fetchVerificationStatus = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/seller/verification-status`,
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        },
      )

      const data = await response.json()
      if (response.ok) {
        setVerificationStatus(data.verificationStatus)
        setDocuments(data.documents || {})
      } else {
        setError(data.message || "Failed to fetch verification status")
      }
    } catch (error) {
      console.error("Failed to fetch verification status:", error)
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (documentType, file) => {
    if (!file) return

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload only JPEG, PNG, or PDF files")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    setUploading((prev) => ({ ...prev, [documentType]: true }))
    setError("")

    const formData = new FormData()
    formData.append("document", file)
    formData.append("documentType", documentType)

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/seller/upload-document`,
        {
          method: "POST",
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
          body: formData,
        },
      )

      const data = await response.json()

      if (response.ok) {
        setDocuments((prev) => ({
          ...prev,
          [documentType]: data.document,
        }))
        alert("Document uploaded successfully!")
      } else {
        setError(data.message || "Upload failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setUploading((prev) => ({ ...prev, [documentType]: false }))
    }
  }

  const submitForVerification = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/seller/submit-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        },
      )

      const data = await response.json()

      if (response.ok) {
        setVerificationStatus("under_review")
        alert("Documents submitted for verification!")
      } else {
        setError(data.message || "Submission failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    }
  }

  const documentRequirements = [
    {
      key: "identityProof",
      title: "Identity Proof",
      description: "Government-issued ID (Passport, Driver's License, National ID)",
      required: true,
      icon: "🆔",
    },
    {
      key: "addressProof",
      title: "Address Proof",
      description: "Utility bill, bank statement, or lease agreement (not older than 3 months)",
      required: true,
      icon: "🏠",
    },
    {
      key: "propertyOwnershipProof",
      title: "Property Ownership Proof",
      description: "Property deed, title certificate, or ownership documents",
      required: true,
      icon: "📋",
    },
    {
      key: "taxDocuments",
      title: "Tax Documents",
      description: "Tax identification number or recent tax returns",
      required: true,
      icon: "📊",
    },
    {
      key: "businessLicense",
      title: "Business License",
      description: "Real estate license or business registration (if applicable)",
      required: false,
      icon: "🏢",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "#10b981"
      case "under_review":
        return "#f59e0b"
      case "rejected":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "verified":
        return "Verified ✅"
      case "under_review":
        return "Under Review 🔍"
      case "rejected":
        return "Rejected ❌"
      default:
        return "Pending 📋"
    }
  }

  const canSubmit = documentRequirements.filter((doc) => doc.required).every((doc) => documents[doc.key]?.path)

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#fff", fontSize: "1.2rem" }}>Loading verification status...</div>
      </div>
    )
  }

  if (verificationStatus === "verified") {
    return (
      <div
        style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}
      >
        <div
          style={{
            maxWidth: "500px",
            width: "100%",
            background: "rgba(255, 255, 255, 0.1)",
            padding: "3rem",
            borderRadius: "15px",
            textAlign: "center",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
          <h1 style={{ color: "#10b981", marginBottom: "1rem" }}>Verification Complete!</h1>
          <p style={{ color: "#a5a5a5", marginBottom: "2rem" }}>
            Your seller account has been verified. You can now list properties on our platform.
          </p>
          <button
            onClick={() => navigate("/seller-dashboard")}
            style={{
              background: "linear-gradient(45deg, #10b981, #059669)",
              color: "#fff",
              border: "none",
              padding: "1rem 2rem",
              borderRadius: "8px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            padding: "2rem",
            borderRadius: "15px",
            marginBottom: "2rem",
            textAlign: "center",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h1 style={{ color: "#fff", marginBottom: "1rem", fontSize: "2.5rem" }}>Seller Verification</h1>
          <p style={{ color: "#a5a5a5", fontSize: "1.1rem", marginBottom: "1rem" }}>
            Complete your verification to start listing properties
          </p>
          <div
            style={{
              display: "inline-block",
              backgroundColor: getStatusColor(verificationStatus),
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              fontWeight: "bold",
            }}
          >
            {getStatusText(verificationStatus)}
          </div>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* Security Notice */}
        <div
          style={{
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            padding: "1.5rem",
            borderRadius: "10px",
            marginBottom: "2rem",
          }}
        >
          <h3 style={{ color: "#3b82f6", marginBottom: "0.5rem" }}>🔒 Why Document Verification?</h3>
          <p style={{ color: "#a5a5a5", fontSize: "0.9rem", marginBottom: "0" }}>
            We verify all sellers to prevent fraudulent property listings and ensure buyer safety. Your documents are
            securely stored and only used for verification purposes.
          </p>
        </div>

        {/* Documents Section */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            padding: "2rem",
            borderRadius: "15px",
            marginBottom: "2rem",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h2 style={{ color: "#fff", marginBottom: "1rem" }}>Required Documents</h2>
          <p style={{ color: "#a5a5a5", marginBottom: "2rem" }}>
            Please upload clear, legible documents in JPEG, PNG, or PDF format (max 5MB each).
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {documentRequirements.map((doc) => (
              <div
                key={doc.key}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  padding: "1.5rem",
                  borderRadius: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>{doc.icon}</span>
                  <h3 style={{ color: "#fff", margin: "0" }}>
                    {doc.title}
                    {doc.required && <span style={{ color: "#ef4444" }}>*</span>}
                  </h3>
                </div>
                <p style={{ color: "#a5a5a5", fontSize: "0.9rem", marginBottom: "1rem" }}>{doc.description}</p>

                {documents[doc.key] ? (
                  <div
                    style={{
                      background: "rgba(16, 185, 129, 0.1)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      padding: "1rem",
                      borderRadius: "8px",
                      marginBottom: "1rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ color: "#10b981", fontWeight: "bold", marginBottom: "0.25rem" }}>
                          ✅ {documents[doc.key].filename}
                        </div>
                        <div style={{ color: "#a5a5a5", fontSize: "0.8rem" }}>
                          {documents[doc.key].verified ? "Verified" : "Pending verification"}
                          {documents[doc.key].rejectionReason && (
                            <div style={{ color: "#ef4444", marginTop: "0.25rem" }}>
                              Rejected: {documents[doc.key].rejectionReason}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => document.getElementById(`file-${doc.key}`).click()}
                        style={{
                          background: "transparent",
                          color: "#10b981",
                          border: "1px solid #10b981",
                          padding: "0.5rem 1rem",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                        }}
                      >
                        Replace
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      border: "2px dashed rgba(255, 255, 255, 0.3)",
                      padding: "2rem",
                      borderRadius: "8px",
                      textAlign: "center",
                      marginBottom: "1rem",
                      cursor: "pointer",
                    }}
                    onClick={() => document.getElementById(`file-${doc.key}`).click()}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📄</div>
                    <p style={{ color: "#a5a5a5", fontSize: "0.9rem" }}>Click to upload or drag and drop</p>
                  </div>
                )}

                <input
                  id={`file-${doc.key}`}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => handleFileUpload(doc.key, e.target.files[0])}
                  style={{ display: "none" }}
                />

                <button
                  onClick={() => document.getElementById(`file-${doc.key}`).click()}
                  disabled={uploading[doc.key]}
                  style={{
                    width: "100%",
                    background: uploading[doc.key]
                      ? "rgba(107, 114, 128, 0.5)"
                      : documents[doc.key]
                        ? "rgba(16, 185, 129, 0.2)"
                        : "linear-gradient(45deg, #2563EB, #1E40AF)",
                    color: "#fff",
                    border: "none",
                    padding: "0.75rem",
                    borderRadius: "5px",
                    cursor: uploading[doc.key] ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {uploading[doc.key] ? "Uploading..." : documents[doc.key] ? "Replace Document" : "Choose File"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Section */}
        {verificationStatus === "pending" && (
          <div style={{ textAlign: "center" }}>
            <button
              onClick={submitForVerification}
              disabled={!canSubmit}
              style={{
                background: canSubmit ? "linear-gradient(45deg, #10b981, #059669)" : "rgba(107, 114, 128, 0.5)",
                color: "#fff",
                border: "none",
                padding: "1rem 3rem",
                borderRadius: "8px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                cursor: canSubmit ? "pointer" : "not-allowed",
                marginBottom: "1rem",
              }}
            >
              Submit for Verification
            </button>
            {!canSubmit && (
              <p style={{ color: "#a5a5a5", fontSize: "0.9rem" }}>
                Please upload all required documents before submitting
              </p>
            )}
          </div>
        )}

        {verificationStatus === "under_review" && (
          <div
            style={{
              background: "rgba(251, 191, 36, 0.1)",
              border: "1px solid rgba(251, 191, 36, 0.3)",
              padding: "2rem",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "#f59e0b", marginBottom: "1rem" }}>Documents Under Review</h3>
            <p style={{ color: "#a5a5a5" }}>
              Your documents are being reviewed by our team. This process typically takes 1-3 business days. We'll
              notify you via email once the review is complete.
            </p>
          </div>
        )}

        {verificationStatus === "rejected" && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              padding: "2rem",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "#ef4444", marginBottom: "1rem" }}>Verification Rejected</h3>
            <p style={{ color: "#a5a5a5", marginBottom: "2rem" }}>
              Unfortunately, your verification was rejected. Please review the feedback above and resubmit the required
              documents.
            </p>
            <button
              onClick={() => setVerificationStatus("pending")}
              style={{
                background: "linear-gradient(45deg, #2563EB, #1E40AF)",
                color: "#fff",
                border: "none",
                padding: "1rem 2rem",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Resubmit Documents
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SellerVerification
