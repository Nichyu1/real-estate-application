"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import SocialLogin from "../components/SocialLogin"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
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
    setLoading(true)

    const result = await login(formData.email, formData.password)

    if (result.success) {
      navigate("/")
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  return (
    <div className="page-container">
      <div className="left-section">
        <h1>Welcome Back</h1>
        <p className="subtitle">Sign in to access your real estate dashboard</p>
      </div>

      <div className="right-section">
        <div className="form-container">
          <h3>Sign In</h3>
          <p className="welcome-text">Welcome back! Please sign in to your account.</p>

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

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <SocialLogin />

          <div className="signup-text">
            Don't have an account?
            <Link to="/signup">Sign up</Link>
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

export default Login
