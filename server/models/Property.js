const mongoose = require("mongoose")

const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      required: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: "USA",
      },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    type: {
      type: String,
      required: true,
      enum: ["house", "apartment", "villa", "penthouse", "land", "cabin", "commercial"],
      lowercase: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["for-sale", "for-rent", "sold", "rented", "under-review"],
      default: "under-review",
    },
    bedrooms: {
      type: Number,
      min: 0,
      default: 0,
    },
    bathrooms: {
      type: Number,
      min: 0,
      default: 0,
    },
    area: {
      type: Number,
      required: true,
      min: 1,
    },
    yearBuilt: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear() + 1,
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    contactInfo: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Property verification documents
    verificationDocuments: {
      ownershipProof: {
        type: String, // File path
        verified: { type: Boolean, default: false },
        uploadedAt: { type: Date },
      },
      surveyReport: {
        type: String, // File path
        verified: { type: Boolean, default: false },
        uploadedAt: { type: Date },
      },
      taxRecords: {
        type: String, // File path
        verified: { type: Boolean, default: false },
        uploadedAt: { type: Date },
      },
      clearanceDocuments: {
        type: String, // File path
        verified: { type: Boolean, default: false },
        uploadedAt: { type: Date },
      },
      valuationReport: {
        type: String, // File path (optional)
        verified: { type: Boolean, default: false },
        uploadedAt: { type: Date },
      },
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "under_review", "verified", "rejected"],
      default: "pending",
    },
    verificationNotes: String,
    views: {
      type: Number,
      default: 0,
    },
    inquiries: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false, // Only active after verification
    },
  },
  {
    timestamps: true,
  },
)

// Index for better search performance
PropertySchema.index({ location: "text", title: "text", description: "text" })
PropertySchema.index({ type: 1, status: 1, price: 1 })
PropertySchema.index({ createdAt: -1 })

module.exports = mongoose.model("Property", PropertySchema)
