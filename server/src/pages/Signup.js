"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import SocialLogin from "../components/SocialLogin"

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "", // buyer or seller
    agreeToTerms: false,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (!formData.userType) {
      setError("Please select whether you are a buyer or seller")
      return
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions")
      return
    }

    setLoading(true)

    const result = await register(formData.name, formData.email, formData.password, formData.userType)

    if (result.success) {
      // Redirect based on user type
      if (formData.userType === "buyer") {
        navigate("/buyer-dashboard")
      } else {
        navigate("/seller-dashboard")
      }
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  return (
    <div className="page-container">
      <div className="left-section">
        <h1>Join Our Community</h1>
        <p className="subtitle">
          {formData.userType === "buyer"
            ? "Find your dream property with thousands of listings"
            : formData.userType === "seller"
              ? "List your property and reach qualified buyers"
              : "Create your account and start your real estate journey"}
        </p>

        {/* User Type Preview */}
        {formData.userType && (
          <div
            style={{ marginTop: "2rem", padding: "1rem", background: "rgba(37, 99, 235, 0.1)", borderRadius: "8px" }}
          >
            <h3 style={{ color: "#2563EB", marginBottom: "0.5rem" }}>
              {formData.userType === "buyer" ? "🏠 Buyer Benefits" : "💼 Seller Benefits"}
            </h3>
            {formData.userType === "buyer" ? (
              <ul style={{ color: "#a5a5a5", lineHeight: "1.6" }}>
                <li>Browse thousands of properties</li>
                <li>Save favorite listings</li>
                <li>Get price alerts</li>
                <li>Connect with verified sellers</li>
              </ul>
            ) : (
              <ul style={{ color: "#a5a5a5", lineHeight: "1.6" }}>
                <li>List unlimited properties</li>
                <li>Reach qualified buyers</li>
                <li>Professional marketing tools</li>
                <li>Analytics and insights</li>
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="right-section">
        <div className="form-container">
          <h3>Create Account</h3>
          <p className="welcome-text">Join thousands of users in our real estate community.</p>

          {error && (
            <div
              className="error-message"
              style={{
                color: "#ff6b6b",
                marginBottom: "20px",
                padding: "10px",
                background: "rgba(255, 107, 107, 0.1)",
                borderRadius: "5px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* User Type Selection */}
            <div className="form-group">
              <label style={{ color: "#fff", marginBottom: "10px", display: "block" }}>I am a:</label>
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <label
                  style={{
                    flex: 1,
                    padding: "12px",
                    border: `2px solid ${formData.userType === "buyer" ? "#2563EB" : "rgba(255, 255, 255, 0.1)"}`,
                    borderRadius: "8px",
                    background: formData.userType === "buyer" ? "rgba(37, 99, 235, 0.1)" : "rgba(40, 40, 40, 0.8)",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                  }}
                >
                  <input
                    type="radio"
                    name="userType"
                    value="buyer"
                    checked={formData.userType === "buyer"}
                    onChange={handleChange}
                    style={{ display: "none" }}
                  />
                  <div>
                    <div style={{ fontSize: "24px", marginBottom: "5px" }}>🏠</div>
                    <div style={{ color: "#fff", fontWeight: "bold" }}>Buyer</div>
                    <div style={{ color: "#a5a5a5", fontSize: "12px" }}>Looking to buy</div>
                  </div>
                </label>

                <label
                  style={{
                    flex: 1,
                    padding: "12px",
                    border: `2px solid ${formData.userType === "seller" ? "#2563EB" : "rgba(255, 255, 255, 0.1)"}`,
                    borderRadius: "8px",
                    background: formData.userType === "seller" ? "rgba(37, 99, 235, 0.1)" : "rgba(40, 40, 40, 0.8)",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                  }}
                >
                  <input
                    type="radio"
                    name="userType"
                    value="seller"
                    checked={formData.userType === "seller"}
                    onChange={handleChange}
                    style={{ display: "none" }}
                  />
                  <div>
                    <div style={{ fontSize: "24px", marginBottom: "5px" }}>💼</div>
                    <div style={{ color: "#fff", fontWeight: "bold" }}>Seller</div>
                    <div style={{ color: "#a5a5a5", fontSize: "12px" }}>Looking to sell</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  required
                />
                I agree to the <Link to="/terms">Terms & Conditions</Link>
              </label>
            </div>

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading
                ? "Creating Account..."
                : `Create ${formData.userType ? formData.userType.charAt(0).toUpperCase() + formData.userType.slice(1) : ""} Account`}
            </button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <SocialLogin />

          <div className="login-text">
            Already have an account?
            <Link to="/login">Sign in</Link>
          </div>

          <div className="footer-links">
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
