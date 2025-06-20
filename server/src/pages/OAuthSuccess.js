"use client"

import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const OAuthSuccess = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()

  useEffect(() => {
    const token = searchParams.get("token")

    if (token) {
      // Store the token
      localStorage.setItem("token", token)

      // Redirect to home page after a short delay
      setTimeout(() => {
        navigate("/", { replace: true })
      }, 2000)
    } else {
      // If no token, redirect to login
      navigate("/login", { replace: true })
    }
  }, [searchParams, navigate])

  return (
    <div className="page-container">
      <div className="left-section">
        <h1>Authentication Successful!</h1>
        <p className="subtitle">You have been successfully signed in</p>
      </div>

      <div className="right-section">
        <div className="form-container">
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div
              className="success-icon"
              style={{
                fontSize: "48px",
                color: "#4CAF50",
                marginBottom: "20px",
              }}
            >
              ✓
            </div>
            <h3>Welcome{user?.name ? `, ${user.name}` : ""}!</h3>
            <p className="welcome-text">Redirecting you to the dashboard...</p>
            <div
              className="loading-spinner"
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #2563EB",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "20px auto",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OAuthSuccess
