const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const passport = require("passport")
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const dns = require("dns").promises
const User = require("../models/User")

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      userType: user.userType,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  )
}

// Advanced email domain validation
const validateEmailDomain = async (email) => {
  const domain = email.split("@")[1]

  // List of disposable/temporary email domains to block
  const disposableDomains = [
    "10minutemail.com",
    "tempmail.org",
    "guerrillamail.com",
    "mailinator.com",
    "throwaway.email",
    "temp-mail.org",
    "yopmail.com",
    "maildrop.cc",
    "sharklasers.com",
    "grr.la",
    "guerrillamailblock.com",
    "pokemail.net",
    "spam4.me",
    "bccto.me",
    "chacuo.net",
    "dispostable.com",
    "emailondeck.com",
    "fakeinbox.com",
    "hide.biz.st",
    "mytrashmail.com",
    "nobulk.com",
    "sogetthis.com",
    "spamherelots.com",
    "superrito.com",
    "zoemail.org",
  ]

  // Check if domain is in disposable list
  if (disposableDomains.includes(domain.toLowerCase())) {
    return { valid: false, reason: "Temporary email addresses are not allowed" }
  }

  // Check if domain has valid MX record
  try {
    const mxRecords = await dns.resolveMx(domain)
    if (!mxRecords || mxRecords.length === 0) {
      return { valid: false, reason: "Invalid email domain - no mail server found" }
    }
  } catch (error) {
    return { valid: false, reason: "Invalid email domain" }
  }

  // Additional checks for common patterns
  const suspiciousPatterns = [
    /^\d+[a-z]*@/i, // emails starting with numbers
    /^[a-z]{1,3}\d+@/i, // very short prefix with numbers
    /test|fake|dummy|sample/i, // test emails
  ]

  const emailPrefix = email.split("@")[0]
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(emailPrefix)) {
      return { valid: false, reason: "Please use a valid personal or business email address" }
    }
  }

  return { valid: true }
}

// Send verification email
const sendVerificationEmail = async (user, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${token}`

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Verify Your Email - Real Estate Platform",
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4169e1; margin: 0;">REALTOR</h1>
        </div>
        
        <h2 style="color: #333;">Welcome to Our Real Estate Platform!</h2>
        <p>Hi ${user.name},</p>
        <p>Thank you for signing up as a <strong>${user.userType}</strong>! Please verify your email address to complete your registration.</p>
        
        ${
          user.userType === "seller"
            ? `
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #856404; margin-top: 0;">Important for Sellers:</h3>
          <p style="color: #856404; margin-bottom: 0;">After email verification, you'll need to complete document verification before you can list properties. This ensures the authenticity of all property listings on our platform.</p>
        </div>
        `
            : ""
        }
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #4169e1; color: white; padding: 15px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Verify Email Address
          </a>
        </div>
        
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666; background-color: #f8f9fa; padding: 10px; border-radius: 3px;">${verificationUrl}</p>
        
        <p><strong>This link will expire in 24 hours.</strong></p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          If you didn't create an account, please ignore this email.
        </p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

// Register a new user
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

    // Validate email domain
    const emailValidation = await validateEmailDomain(email)
    if (!emailValidation.valid) {
      return res.status(400).json({ message: emailValidation.reason })
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
      emailVerified: false,
    })

    await user.save()
    console.log("User created successfully:", user._id)

    // Send verification email
    try {
      await sendVerificationEmail(user, emailVerificationToken)
      console.log("Verification email sent successfully to:", email)
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)
      // Don't fail registration if email fails
      // Instead, allow registration to complete and provide a way to resend verification
    }

    res.status(201).json({
      message: "Account created successfully! Please check your email to verify your account.",
      requiresVerification: true,
      email: user.email,
      userType: user.userType,
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error during registration" })
  }
})

// Verify email
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token" })
    }

    user.emailVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationExpires = undefined
    await user.save()

    // Generate JWT token for automatic login
    const jwtToken = generateToken(user)

    res.json({
      message: "Email verified successfully!",
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.userType,
        emailVerified: user.emailVerified,
        needsVerification: user.userType === "seller" && !user.sellerProfile?.verified,
      },
    })
  } catch (error) {
    console.error("Email verification error:", error)
    res.status(500).json({ message: "Server error during email verification" })
  }
})

// Resend verification email
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email is already verified" })
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex")
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    user.emailVerificationToken = emailVerificationToken
    user.emailVerificationExpires = emailVerificationExpires
    await user.save()

    // Send verification email
    await sendVerificationEmail(user, emailVerificationToken)

    res.json({ message: "Verification email sent successfully!" })
  } catch (error) {
    console.error("Resend verification error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    console.log("Login attempt:", { email })

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(400).json({
        message: "Please verify your email before logging in",
        requiresVerification: true,
        email: user.email,
      })
    }

    // Check if user has a password (might be a social login user)
    if (!user.password) {
      return res.status(400).json({
        message: "This account was created with a social login. Please use that method to sign in.",
      })
    }

    // Verify password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    console.log("Login successful for user:", user._id)

    // Generate token
    const token = generateToken(user)

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.userType,
        emailVerified: user.emailVerified,
        needsVerification: user.userType === "seller" && !user.sellerProfile?.verified,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error during login" })
  }
})

// Update user type for OAuth users
router.put("/update-user-type", async (req, res) => {
  try {
    // Get token from header
    const token = req.header("x-auth-token")
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { userType } = req.body

    // Validate userType
    if (!userType || !["buyer", "seller"].includes(userType)) {
      return res.status(400).json({ message: "Please specify if you are a buyer or seller" })
    }

    // Update user
    const user = await User.findByIdAndUpdate(decoded.id, { userType }, { new: true }).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.userType,
        emailVerified: user.emailVerified,
        needsVerification: user.userType === "seller" && !user.sellerProfile?.verified,
      },
    })
  } catch (error) {
    console.error("Update user type error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get current user
router.get("/me", async (req, res) => {
  try {
    // Get token from header
    const token = req.header("x-auth-token")
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

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

// Google OAuth routes - only if configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))

  router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    async (req, res) => {
      // Validate email domain for OAuth users too
      const emailValidation = await validateEmailDomain(req.user.email)
      if (!emailValidation.valid) {
        return res.redirect(
          `${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=${encodeURIComponent(
            emailValidation.reason,
          )}`,
        )
      }

      // Generate JWT token
      const token = generateToken(req.user)

      // OAuth users are automatically verified
      req.user.emailVerified = true
      await req.user.save()

      // Check if user has a userType set
      const needsUserType = !req.user.userType

      if (needsUserType) {
        // New user - redirect to select user type
        return res.redirect(
          `${process.env.FRONTEND_URL || "http://localhost:3000"}/signup?token=${token}&needsUserType=true`,
        )
      }

      // Existing user - redirect to success page
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/oauth-success?token=${token}`)
    },
  )
} else {
  // Fallback routes for when OAuth is not configured
  router.get("/google", (req, res) => {
    res.status(501).json({ message: "Google OAuth not configured" })
  })

  router.get("/google/callback", (req, res) => {
    res.status(501).json({ message: "Google OAuth not configured" })
  })
}

// GitHub OAuth routes - only if configured
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  router.get("/github", passport.authenticate("github", { scope: ["user:email"] }))

  router.get(
    "/github/callback",
    passport.authenticate("github", { session: false, failureRedirect: "/login" }),
    async (req, res) => {
      // Validate email domain for OAuth users too
      const emailValidation = await validateEmailDomain(req.user.email)
      if (!emailValidation.valid) {
        return res.redirect(
          `${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=${encodeURIComponent(
            emailValidation.reason,
          )}`,
        )
      }

      // Generate JWT token
      const token = generateToken(req.user)

      // OAuth users are automatically verified
      req.user.emailVerified = true
      await req.user.save()

      // Check if user has a userType set
      const needsUserType = !req.user.userType

      if (needsUserType) {
        // New user - redirect to select user type
        return res.redirect(
          `${process.env.FRONTEND_URL || "http://localhost:3000"}/signup?token=${token}&needsUserType=true`,
        )
      }

      // Existing user - redirect to success page
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/oauth-success?token=${token}`)
    },
  )
} else {
  // Fallback routes for when OAuth is not configured
  router.get("/github", (req, res) => {
    res.status(501).json({ message: "GitHub OAuth not configured" })
  })

  router.get("/github/callback", (req, res) => {
    res.status(501).json({ message: "GitHub OAuth not configured" })
  })
}

module.exports = router
