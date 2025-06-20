const express = require("express")
const passport = require("passport")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const User = require("../models/User")

const router = express.Router()

// Add this debug log at the top to confirm the file is being loaded
console.log("🚀 AUTH ROUTES FILE LOADED!")

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      userType: user.userType,
    },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "7d" },
  )
}

// Add debug log for Google route registration
console.log("📝 Registering Google OAuth routes...")

// Google OAuth Routes
router.get("/google", (req, res, next) => {
  console.log("🔍 Google OAuth route hit!")
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next)
})

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login?error=oauth_failed",
  }),
  async (req, res) => {
    try {
      console.log("Google OAuth Success:", req.user)

      // Generate JWT token for the OAuth user
      const token = generateToken(req.user)

      // Check if user needs to complete signup (set userType)
      if (!req.user.userType) {
        // Redirect to complete signup with token
        res.redirect(`http://localhost:3000/complete-signup?token=${token}`)
      } else {
        // User is fully registered, redirect to dashboard with token
        res.redirect(`http://localhost:3000/dashboard?token=${token}`)
      }
    } catch (error) {
      console.error("Google OAuth callback error:", error)
      res.redirect("http://localhost:3000/login?error=oauth_callback_failed")
    }
  },
)

// GitHub OAuth Routes
router.get("/github", (req, res, next) => {
  console.log("🔍 GitHub OAuth route hit!")
  passport.authenticate("github", {
    scope: ["user:email"],
  })(req, res, next)
})

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "http://localhost:3000/login?error=oauth_failed",
  }),
  async (req, res) => {
    try {
      console.log("GitHub OAuth Success:", req.user)

      // Generate JWT token for the OAuth user
      const token = generateToken(req.user)

      if (!req.user.userType) {
        res.redirect(`http://localhost:3000/complete-signup?token=${token}`)
      } else {
        res.redirect(`http://localhost:3000/dashboard?token=${token}`)
      }
    } catch (error) {
      console.error("GitHub OAuth callback error:", error)
      res.redirect("http://localhost:3000/login?error=oauth_callback_failed")
    }
  },
)

// Test route to verify routes are working
router.get("/test", (req, res) => {
  console.log("🧪 Test route hit!")
  res.json({ message: "Auth routes are working!" })
})

// Complete signup for OAuth users (set userType)
router.post("/complete-signup", async (req, res) => {
  try {
    // Get token from header or body
    const token = req.header("x-auth-token") || req.body.token
    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    const { userType } = req.body

    if (!userType || !["buyer", "seller"].includes(userType)) {
      return res.status(400).json({
        message: "Valid user type is required (buyer or seller)",
      })
    }

    // Update user with userType
    user.userType = userType
    await user.save()

    // Generate new token with updated user info
    const newToken = generateToken(user)

    res.json({
      message: "Signup completed successfully",
      token: newToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        emailVerified: user.emailVerified,
      },
    })
  } catch (error) {
    console.error("Complete signup error:", error)
    res.status(500).json({
      message: "Server error completing signup",
    })
  }
})

// Register a new user (existing route)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, userType } = req.body

    console.log("Registration attempt:", { name, email, userType })

    // Validate required fields
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Validate userType
    if (!["buyer", "seller"].includes(userType)) {
      return res.status(400).json({ message: "Please specify if you are a buyer or seller" })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" })
    }

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex")
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create new user
    const user = new User({
      name,
      email,
      password,
      userType,
      emailVerificationToken,
      emailVerificationExpires,
      // For testing purposes, set emailVerified to true
      emailVerified: true,
    })

    await user.save()
    console.log("User created successfully:", user._id)

    // Generate token for immediate login
    const token = generateToken(user)

    // Return success with token
    res.status(201).json({
      message: "Account created successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        emailVerified: user.emailVerified,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error during registration" })
  }
})

// Login user (existing route)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Enhanced logging
    console.log("📝 Login attempt received:", { email, timestamp: new Date().toISOString() })

    // Input validation
    if (!email || !password) {
      console.log("❌ Login failed: Missing credentials")
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required",
        error: "MISSING_CREDENTIALS"
      })
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("❌ Login failed: Invalid email format")
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
        error: "INVALID_EMAIL"
      })
    }

    // Find user by email with error handling
    let user;
    try {
      user = await User.findOne({ email })
    } catch (dbError) {
      console.error("❌ Database error during user lookup:", dbError)
      return res.status(500).json({
        success: false,
        message: "Error accessing user data",
        error: "DATABASE_ERROR"
      })
    }

    if (!user) {
      console.log("❌ Login failed: User not found")
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        error: "INVALID_CREDENTIALS"
      })
    }

    // Check if account is locked
    if (user.isLocked) {
      console.log("❌ Login failed: Account locked")
      return res.status(403).json({
        success: false,
        message: "Account is locked. Please try again later.",
        error: "ACCOUNT_LOCKED",
        lockUntil: user.lockUntil
      })
    }

    // Check if user is active
    if (user.status === 'inactive') {
      console.log("❌ Login failed: Account inactive")
      return res.status(403).json({
        success: false,
        message: "Account is inactive. Please contact support.",
        error: "ACCOUNT_INACTIVE"
      })
    }

    // Verify password with error handling
    let isMatch;
    try {
      isMatch = await user.comparePassword(password)
    } catch (passwordError) {
      console.error("❌ Password comparison error:", passwordError)
      return res.status(500).json({
        success: false,
        message: "Error verifying password",
        error: "PASSWORD_VERIFICATION_ERROR"
      })
    }

    if (!isMatch) {
      // Increment login attempts
      await user.incrementLoginAttempts()
      
      console.log("❌ Login failed: Invalid password")
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        error: "INVALID_CREDENTIALS"
      })
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts()
    
    // Update last login
    user.lastLogin = new Date()
    await user.save()

    console.log("✅ Login successful for user:", user._id)

    // Generate token with error handling
    let token;
    try {
      token = generateToken(user)
    } catch (tokenError) {
      console.error("❌ Token generation error:", tokenError)
      return res.status(500).json({
        success: false,
        message: "Error generating authentication token",
        error: "TOKEN_GENERATION_ERROR"
      })
    }

    // Send success response
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        userType: user.userType || 'buyer',
        emailVerified: user.emailVerified || false,
        needsVerification: user.userType === "seller" && !(user.sellerProfile?.verified || false),
        status: user.status,
        lastLogin: user.lastLogin
      },
    })
  } catch (error) {
    console.error("❌ Login error:", error)
    res.status(500).json({ 
      success: false,
      message: "An error occurred during login. Please try again.",
      error: "SERVER_ERROR"
    })
  }
})

// Get current user (existing route)
router.get("/me", async (req, res) => {
  try {
    // Get token from header
    const token = req.header("x-auth-token")
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    // Find user
    const user = await User.findById(decoded.id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error("Auth error:", error)
    res.status(401).json({ message: "Token is not valid" })
  }
})

// Logout route (for session cleanup if needed)
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err)
    }
  })
  res.json({ message: "Logged out successfully" })
})

// Debug route to check authentication status
router.get("/debug", (req, res) => {
  const token = req.header("x-auth-token")
  let tokenInfo = null

  if (token) {
    try {
      tokenInfo = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
    } catch (error) {
      tokenInfo = { error: "Invalid token" }
    }
  }

  res.json({
    hasToken: !!token,
    tokenInfo,
    isAuthenticated: req.isAuthenticated(),
    passportUser: req.user || null,
    session: req.session,
  })
})

console.log("✅ All auth routes registered successfully!")

module.exports = router
