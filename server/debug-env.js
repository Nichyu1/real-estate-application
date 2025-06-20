// Create this file to test environment variables
require("dotenv").config()

console.log("Environment Variables Check:")
console.log("PORT:", process.env.PORT)
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Set" : "Not set")
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Set" : "Not set")
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set")
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Not set")
console.log("GITHUB_CLIENT_ID:", process.env.GITHUB_CLIENT_ID ? "Set" : "Not set")
console.log("GITHUB_CLIENT_SECRET:", process.env.GITHUB_CLIENT_SECRET ? "Set" : "Not set")
