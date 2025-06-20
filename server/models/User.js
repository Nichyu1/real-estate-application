const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    userType: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer",
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    googleId: {
      type: String,
    },
    githubId: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpires: {
      type: Date,
    },
    // Buyer-specific fields
    savedProperties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
    searchPreferences: {
      priceRange: {
        min: Number,
        max: Number,
      },
      propertyTypes: [String],
      locations: [String],
    },
    // Seller-specific fields
    listedProperties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
    sellerProfile: {
      phone: String,
      address: String,
      licenseNumber: String,
      verified: {
        type: Boolean,
        default: false,
      },
      // Document verification for sellers
      documents: {
        identityProof: {
          filename: String,
          path: String,
          verified: { type: Boolean, default: false },
          uploadedAt: { type: Date },
          rejectionReason: String,
        },
        addressProof: {
          filename: String,
          path: String,
          verified: { type: Boolean, default: false },
          uploadedAt: { type: Date },
          rejectionReason: String,
        },
        propertyOwnershipProof: {
          filename: String,
          path: String,
          verified: { type: Boolean, default: false },
          uploadedAt: { type: Date },
          rejectionReason: String,
        },
        taxDocuments: {
          filename: String,
          path: String,
          verified: { type: Boolean, default: false },
          uploadedAt: { type: Date },
          rejectionReason: String,
        },
        businessLicense: {
          filename: String,
          path: String,
          verified: { type: Boolean, default: false },
          uploadedAt: { type: Date },
          rejectionReason: String,
        },
      },
      verificationStatus: {
        type: String,
        enum: ["pending", "under_review", "verified", "rejected"],
        default: "pending",
      },
      verificationNotes: String,
      verifiedAt: Date,
      canListProperties: {
        type: Boolean,
        default: false,
      },
    },
    lastLogin: {
      type: Date,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
)

// Hash password before saving
UserSchema.pre("save", async function (next) {
  // Only hash the password if it's modified or new
  if (!this.isModified("password") || !this.password) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    throw new Error("Error comparing passwords")
  }
}

// Method to increment login attempts
UserSchema.methods.incrementLoginAttempts = async function() {
  // If we have a previous lock that has expired, reset the attempts
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return await this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    })
  }
  // Otherwise increment the attempts
  const updates = { $inc: { loginAttempts: 1 } }
  // Lock the account if we've reached max attempts
  if (this.loginAttempts + 1 >= 5) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 } // 2 hours
  }
  return await this.updateOne(updates)
}

// Method to reset login attempts
UserSchema.methods.resetLoginAttempts = async function() {
  return await this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  })
}

// Virtual for checking if account is locked
UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

module.exports = mongoose.model("User", UserSchema)
