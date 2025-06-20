"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../styles/Signup.css"

const Signup = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "buyer",
    terms: false,
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [message, setMessage] = useState("")

  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get("token")
  const needsUserType = queryParams.get("needsUserType") === "true"
  const isOAuthFlow = token && needsUserType

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.terms) {
      setError("You must agree to the terms before registering.")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001"

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.token) localStorage.setItem("token", data.token)

        setFormSubmitted(true)
        setMessage(data.message || "Account created successfully!")

        setTimeout(() => {
          navigate(formData.userType === "buyer" ? "/buyer-dashboard" : "/seller-dashboard")
        }, 1500)
      } else {
        setError(data.message || "Failed to create account")
      }
    } catch (err) {
      console.error("Signup error:", err)
      setError("Connection error. Please check your internet connection and try again.")
    } finally {
      if (!formSubmitted) setLoading(false)
    }
  }

  const handleOAuthUserTypeSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/auth/update-user-type`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({ userType: formData.userType }),
        },
      )

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(data.user))

        setFormSubmitted(true)

        setTimeout(() => {
          navigate(formData.userType === "buyer" ? "/buyer-dashboard" : "/seller-dashboard")
        }, 1500)
      } else {
        setError(data.message || "Failed to update user type")
        setLoading(false)
      }
    } catch (err) {
      console.error("OAuth user type error:", err)
      setError("Something went wrong!")
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    const googleBtn = document.getElementById("google-btn")
    if (googleBtn) googleBtn.classList.add("loading")
    window.location.href = `${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/auth/google`
  }

  const handleGithubLogin = () => {
    const githubBtn = document.getElementById("github-btn")
    if (githubBtn) githubBtn.classList.add("loading")
    window.location.href = `${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/auth/github`
  }

  const preventLink = (e) => e.preventDefault()

  // OAuth user type selection flow
  if (isOAuthFlow) {
    return (
      <div className="auth-page">
        <div className="auth-left">
          <h1>Almost There!</h1>
          <div className="auth-subtitle">Complete your account by choosing a role</div>
        </div>

        <div className="auth-right">
          <div className={`signup-container ${formSubmitted ? "success-animation" : ""}`}>
            {formSubmitted ? (
              <div className="success-message">
                <div className="checkmark-circle">
                  <div className="checkmark draw"></div>
                </div>
                <h2>Registration Complete!</h2>
                <p>Redirecting to your dashboard...</p>
              </div>
            ) : (
              <>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleOAuthUserTypeSubmit}>
                  <div className="form-group">
                    <label>I am a:</label>
                    <div className="user-type-selector">
                      <label className={`user-type-option ${formData.userType === "buyer" ? "selected" : ""}`}>
                        <input
                          type="radio"
                          name="userType"
                          value="buyer"
                          checked={formData.userType === "buyer"}
                          onChange={handleChange}
                        />
                        <div className="user-type-content">
                          <div className="user-type-icon">🏠</div>
                          <div className="user-type-title">Buyer</div>
                          <div className="user-type-desc">Looking to buy properties</div>
                        </div>
                      </label>

                      <label className={`user-type-option ${formData.userType === "seller" ? "selected" : ""}`}>
                        <input
                          type="radio"
                          name="userType"
                          value="seller"
                          checked={formData.userType === "seller"}
                          onChange={handleChange}
                        />
                        <div className="user-type-content">
                          <div className="user-type-icon">💼</div>
                          <div className="user-type-title">Seller</div>
                          <div className="user-type-desc">Looking to sell properties</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <button type="submit" className={`signup-button ${loading ? "loading" : ""}`} disabled={loading}>
                    {loading ? (
                      <span className="button-content">
                        <span className="spinner"></span>
                        <span>Completing...</span>
                      </span>
                    ) : (
                      "Complete Registration"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Regular signup
  return (
    <div className="auth-page">
      <div className="auth-left">
        <h1>Welcome!</h1>
        <div className="auth-subtitle">Create your account to get started</div>
      </div>

      <div className="auth-right">
        <div className={`signup-container ${formSubmitted ? "success-animation" : ""}`}>
          {formSubmitted ? (
            <div className="success-message">
              <div className="checkmark-circle">
                <div className="checkmark draw"></div>
              </div>
              <h2>Account Created!</h2>
              <p>{message}</p>
            </div>
          ) : (
            <>
              {error && <div className="error-message">{error}</div>}
              {message && <div className="info-message">{message}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    minLength={6}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>I am a:</label>
                  <div className="user-type-selector">
                    <label className={`user-type-option ${formData.userType === "buyer" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="userType"
                        value="buyer"
                        checked={formData.userType === "buyer"}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <div className="user-type-content">
                        <div className="user-type-icon">🏠</div>
                        <div className="user-type-title">Buyer</div>
                        <div className="user-type-desc">Looking to buy</div>
                      </div>
                    </label>

                    <label className={`user-type-option ${formData.userType === "seller" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="userType"
                        value="seller"
                        checked={formData.userType === "seller"}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <div className="user-type-content">
                        <div className="user-type-icon">💼</div>
                        <div className="user-type-title">Seller</div>
                        <div className="user-type-desc">Looking to sell</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                    <span>
                      I agree to the{" "}
                      <a href="#" onClick={preventLink}>Terms of Service</a> and{" "}
                      <a href="#" onClick={preventLink}>Privacy Policy</a>
                    </span>
                  </label>
                </div>

                <button type="submit" className={`signup-button ${loading ? "loading" : ""}`} disabled={loading}>
                  {loading ? (
                    <span className="button-content">
                      <span className="spinner"></span>
                      <span>Creating Account...</span>
                    </span>
                  ) : (
                    "Create account"
                  )}
                </button>

                <div className="social-login">
                  <p>Or sign up using</p>
                  <div className="social-buttons">
                    <button
                      type="button"
                      id="google-btn"
                      className="google-btn"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                        alt="Google"
                      />
                      <span>Google</span>
                    </button>
                    <button
                      type="button"
                      id="github-btn"
                      className="github-btn"
                      onClick={handleGithubLogin}
                      disabled={loading}
                    >
                      <img
                        src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                        alt="GitHub"
                      />
                      <span>GitHub</span>
                    </button>
                  </div>
                </div>
              </form>

              <div className="login-link">
                <p>
                  Already have an account? <Link to="/login">Sign in</Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Signup
{/*"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../styles/Signup.css"

const Signup = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "buyer",
    terms: false,
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [message, setMessage] = useState("")

  // Check if we're in OAuth user type selection mode
  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get("token")
  const needsUserType = queryParams.get("needsUserType") === "true"
  const isOAuthFlow = token && needsUserType

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.terms) {
      setError("You must agree to the terms before registering.")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    try {
      console.log("Submitting signup form:", {
        name: formData.name,
        email: formData.email,
        userType: formData.userType,
      })

      // Direct API call instead of using context for debugging
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001"

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          userType: formData.userType,
        }),
      })

      const data = await response.json()
      console.log("Signup response:", data)

      if (response.ok) {
        // Store token if provided
        if (data.token) {
          localStorage.setItem("token", data.token)
        }

        setFormSubmitted(true)
        setMessage(data.message || "Account created successfully!")

        // Show success animation before redirecting
        setTimeout(() => {
          // Redirect based on user type
          if (formData.userType === "buyer") {
            navigate("/buyer-dashboard")
          } else {
            navigate("/seller-dashboard")
          }
        }, 1500)
      } else {
        setError(data.message || "Failed to create account")
      }
    } catch (error) {
      console.error("Signup error:", error)
      setError("Connection error. Please check your internet connection and try again.")
    } finally {
      if (!formSubmitted) {
        setLoading(false)
      }
    }
  }

  const handleOAuthUserTypeSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Update user type for OAuth users
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/auth/update-user-type`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({ userType: formData.userType }),
        },
      )

      const data = await response.json()

      if (response.ok) {
        // Store token and redirect
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(data.user))

        setFormSubmitted(true)

        // Show success animation before redirecting
        setTimeout(() => {
          // Redirect based on user type
          if (formData.userType === "buyer") {
            navigate("/buyer-dashboard")
          } else {
            navigate("/seller-dashboard")
          }
        }, 1500)
      } else {
        setError(data.message || "Failed to update user type")
        setLoading(false)
      }
    } catch (error) {
      console.error("OAuth user type error:", error)
      setError("Something went wrong!")
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // Show loading animation for Google button
    const googleBtn = document.getElementById("google-btn")
    if (googleBtn) googleBtn.classList.add("loading")
    // Use the correct API endpoint for Google OAuth
    window.location.href = `${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/auth/google`
  }

  const handleGithubLogin = () => {
    // Show loading animation for GitHub button
    const githubBtn = document.getElementById("github-btn")
    if (githubBtn) githubBtn.classList.add("loading")
    // Use the correct API endpoint for GitHub OAuth
    window.location.href = `${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/auth/github`
  }

  const preventLink = (e) => e.preventDefault()

  // Render OAuth user type selection form
  if (isOAuthFlow) {
    return (
      <div className="signup-page">
        <div className={`signup-container ${formSubmitted ? "success-animation" : ""}`}>
          {formSubmitted ? (
            <div className="success-message">
              <div className="checkmark-circle">
                <div className="checkmark draw"></div>
              </div>
              <h2>Registration Complete!</h2>
              <p>Redirecting to your dashboard...</p>
            </div>
          ) : (
            <>
              <h1>Complete Your Registration</h1>
              <p>Please select your account type to continue</p>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleOAuthUserTypeSubmit}>
                <div className="form-group">
                  <label>I am a:</label>
                  <div className="user-type-selector">
                    <label className={`user-type-option ${formData.userType === "buyer" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="userType"
                        value="buyer"
                        checked={formData.userType === "buyer"}
                        onChange={handleChange}
                      />
                      <div className="user-type-content">
                        <div className="user-type-icon">🏠</div>
                        <div className="user-type-title">Buyer</div>
                        <div className="user-type-desc">Looking to buy properties</div>
                      </div>
                    </label>

                    <label className={`user-type-option ${formData.userType === "seller" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="userType"
                        value="seller"
                        checked={formData.userType === "seller"}
                        onChange={handleChange}
                      />
                      <div className="user-type-content">
                        <div className="user-type-icon">💼</div>
                        <div className="user-type-title">Seller</div>
                        <div className="user-type-desc">Looking to sell properties</div>
                      </div>
                    </label>
                  </div>
                </div>

                <button type="submit" className={`signup-button ${loading ? "loading" : ""}`} disabled={loading}>
                  {loading ? (
                    <span className="button-content">
                      <span className="spinner"></span>
                      <span>Completing...</span>
                    </span>
                  ) : (
                    "Complete Registration"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    )
  }

  // Regular signup form
  return (
    <div className="signup-page">
      <div className={`signup-container ${formSubmitted ? "success-animation" : ""}`}>
        {formSubmitted ? (
          <div className="success-message">
            <div className="checkmark-circle">
              <div className="checkmark draw"></div>
            </div>
            <h2>Account Created!</h2>
            <p>{message}</p>
          </div>
        ) : (
          <>
            <h1>Create an account</h1>
            <p>Enter your details below to create your account</p>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="info-message">{message}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  disabled={loading}
                  className={loading ? "input-disabled" : ""}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                  className={loading ? "input-disabled" : ""}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  minLength={6}
                  disabled={loading}
                  className={loading ? "input-disabled" : ""}
                />
              </div>

              <div className="form-group">
                <label>I am a:</label>
                <div className="user-type-selector">
                  <label className={`user-type-option ${formData.userType === "buyer" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="userType"
                      value="buyer"
                      checked={formData.userType === "buyer"}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <div className="user-type-content">
                      <div className="user-type-icon">🏠</div>
                      <div className="user-type-title">Buyer</div>
                      <div className="user-type-desc">Looking to buy</div>
                    </div>
                  </label>

                  <label className={`user-type-option ${formData.userType === "seller" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="userType"
                      value="seller"
                      checked={formData.userType === "seller"}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <div className="user-type-content">
                      <div className="user-type-icon">💼</div>
                      <div className="user-type-title">Seller</div>
                      <div className="user-type-desc">Looking to sell</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <span>
                    I agree to the{" "}
                    <a href="#" onClick={preventLink}>
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" onClick={preventLink}>
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>

              <button type="submit" className={`signup-button ${loading ? "loading" : ""}`} disabled={loading}>
                {loading ? (
                  <span className="button-content">
                    <span className="spinner"></span>
                    <span>Creating Account...</span>
                  </span>
                ) : (
                  "Create account"
                )}
              </button>

              <div className="social-login">
                <p>Or sign up using</p>
                <div className="social-buttons">
                  <button
                    type="button"
                    id="google-btn"
                    className="google-btn"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                      alt="Google"
                    />
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    id="github-btn"
                    className="github-btn"
                    onClick={handleGithubLogin}
                    disabled={loading}
                  >
                    <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" />
                    <span>GitHub</span>
                  </button>
                </div>
              </div>
            </form>

            <div className="login-link">
              <p>
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Signup
*/}