"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../styles/Login.css"

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

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5001/api/auth/google"
  }

  const handleGithubLogin = () => {
    window.location.href = "http://localhost:5001/api/auth/github"
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <h1>Welcome Back!</h1>
        <div className="auth-subtitle">Sign in to access your real estate dashboard</div>
      </div>

      <div className="auth-right">
        <div className="auth-container">
          <div className="auth-header">
            <h2 className="auth-title">Sign In</h2>
            <p>Please enter your details to sign in</p>
          </div>

          {error && (
            <div
              style={{
                color: "#ff6b6b",
                marginBottom: "20px",
                padding: "10px",
                background: "rgba(255, 107, 107, 0.1)",
                borderRadius: "5px",
                textAlign: "center",
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
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Signing In..." : "Sign in"}
            </button>
          </form>

          <div className="divider">Or</div>

          <div className="social-login">
            <button type="button" className="social-button" onClick={handleGoogleLogin}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
            </button>
            <button type="button" className="social-button" onClick={handleGithubLogin}>
              <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" />
            </button>
          </div>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
            <div className="footer-links">
              <Link to="/terms">Terms of Service</Link>
              <Link to="/privacy">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
