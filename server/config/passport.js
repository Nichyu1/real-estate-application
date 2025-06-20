// Make sure dotenv is loaded here too
require("dotenv").config()

const GoogleStrategy = require("passport-google-oauth20").Strategy
const GitHubStrategy = require("passport-github2").Strategy
const User = require("../models/User")

// Export a function that takes passport as a parameter
module.exports = (passport) => {
  // Debug: Log environment variables
  console.log("Passport Config - Environment Check:")
  console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "✓ Set" : "✗ Not set")
  console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "✓ Set" : "✗ Not set")
  console.log("GITHUB_CLIENT_ID:", process.env.GITHUB_CLIENT_ID ? "✓ Set" : "✗ Not set")
  console.log("GITHUB_CLIENT_SECRET:", process.env.GITHUB_CLIENT_SECRET ? "✓ Set" : "✗ Not set")

  // Serialize user into the session
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // Deserialize user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id)
      done(null, user)
    } catch (error) {
      done(error, null)
    }
  })

  // Google OAuth Strategy - only initialize if credentials are provided
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    console.log("✓ Initializing Google OAuth Strategy")
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "/api/auth/google/callback",
          scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user already exists by email
            let user = await User.findOne({ email: profile.emails[0].value })

            if (user) {
              // If user exists but was registered with a different method, update Google ID
              if (!user.googleId) {
                user.googleId = profile.id
                await user.save()
              }
              return done(null, user)
            }

            // Create new user - don't set userType yet, will be set during signup flow
            user = new User({
              name: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
              avatar: profile.photos[0].value,
              emailVerified: true, // Google emails are verified
              // userType will be set later in the signup flow
            })

            await user.save()
            return done(null, user)
          } catch (error) {
            return done(error, null)
          }
        },
      ),
    )
  } else {
    console.log("✗ Google OAuth not configured - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET required")
  }

  // GitHub OAuth Strategy - only initialize if credentials are provided
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    console.log("✓ Initializing GitHub OAuth Strategy")
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: "/api/auth/github/callback",
          scope: ["user:email"],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Get primary email from GitHub
            const email = profile.emails && profile.emails[0].value

            if (!email) {
              return done(new Error("GitHub email not available"), null)
            }

            // Check if user already exists
            let user = await User.findOne({ email })

            if (user) {
              // If user exists but was registered with a different method, update GitHub ID
              if (!user.githubId) {
                user.githubId = profile.id
                await user.save()
              }
              return done(null, user)
            }

            // Create new user - don't set userType yet, will be set during signup flow
            user = new User({
              name: profile.displayName || profile.username,
              email,
              githubId: profile.id,
              avatar: profile.photos[0].value,
              emailVerified: true, // GitHub emails are verified
              // userType will be set later in the signup flow
            })

            await user.save()
            return done(null, user)
          } catch (error) {
            return done(error, null)
          }
        },
      ),
    )
  } else {
    console.log("✗ GitHub OAuth not configured - GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET required")
  }
}
