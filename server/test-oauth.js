require("dotenv").config()

console.log("Direct Environment Variable Test:")
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID)
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET)
console.log("GITHUB_CLIENT_ID:", process.env.GITHUB_CLIENT_ID)
console.log("GITHUB_CLIENT_SECRET:", process.env.GITHUB_CLIENT_SECRET)

// Test the exact condition from passport.js
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  console.log("✓ Google OAuth would be initialized")
} else {
  console.log("✗ Google OAuth would NOT be initialized")
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  console.log("✓ GitHub OAuth would be initialized")
} else {
  console.log("✗ GitHub OAuth would NOT be initialized")
}
