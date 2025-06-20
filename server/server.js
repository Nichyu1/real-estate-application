const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const passport = require("passport")
const session = require("express-session")
const path = require("path")
require("dotenv").config()

const app = express()

console.log("🚀 Starting server...")

// Import passport configuration
console.log("📝 Loading passport configuration...")
require("./config/passport")(passport)

// Enhanced CORS configuration
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
  exposedHeaders: ["x-auth-token"],
  maxAge: 86400 // 24 hours
}

app.use(cors(corsOptions))

// Body parser middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Session middleware for passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// MongoDB connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/realtor", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("✅ MongoDB connected successfully")
  } catch (err) {
    console.error("❌ MongoDB connection error:", err)
    console.log("🔄 Retrying connection in 5 seconds...")
    setTimeout(connectDB, 5000)
  }
}

connectDB()

// Routes
console.log("📝 Loading routes...")
console.log("Loading auth routes...")
app.use("/api/auth", require("./routes/auth-simplified"))
console.log("Loading properties routes...")
app.use("/api/properties", require("./routes/properties"))
console.log("Loading upload routes...")
app.use("/api/upload", require("./routes/upload"))
console.log("Loading seller routes...")
app.use("/api/seller", require("./routes/seller"))

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Add a route to list all registered routes (for debugging)
app.get("/api/routes", (req, res) => {
  const routes = []
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods),
      })
    } else if (middleware.name === "router") {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push({
            path: middleware.regexp.source.replace("\\", "").replace("(?:", "").replace(")", ""),
            route: handler.route.path,
            methods: Object.keys(handler.route.methods),
          })
        }
      })
    }
  })
  res.json({ routes })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err)
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : "SERVER_ERROR"
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    error: "NOT_FOUND"
  })
})

// Serve static files from React app in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"))
  })
}

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📍 Test your auth routes at: http://localhost:${PORT}/api/auth/test`)
  console.log(`📍 Google OAuth at: http://localhost:${PORT}/api/auth/google`)
  console.log(`📍 Health check at: http://localhost:${PORT}/api/health`)
  console.log(`📍 View all routes at: http://localhost:${PORT}/api/routes`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err)
  // Don't crash the server, just log the error
})
