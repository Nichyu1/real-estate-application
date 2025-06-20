"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const EmailVerification = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [status, setStatus] = useState("verifying") // verifying, success, error
  const [message, setMessage] = useState("")
  const [userType, setUserType] = useState("")

  useEffect(() => {
    const verifyEmail = async () => {
      const queryParams = new URLSearchParams(location.search)
      const token = queryParams.get("token")

      if (!token) {
        setStatus("error")
        setMessage("Invalid verification link")
        return
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/auth/verify-email?token=${token}`,
        )

        const data = await response.json()

        if (response.ok) {
          setStatus("success")
          setMessage(data.message)
          setUserType(data.user.userType)

          // Auto-login the user
          localStorage.setItem("token", data.token)
          localStorage.setItem("user", JSON.stringify(data.user))

          // Redirect after 3 seconds
          setTimeout(() => {
            if (data.user.userType === "seller" && data.user.needsVerification) {
              navigate("/seller-verification")
            } else if (data.user.userType === "buyer") {
              navigate("/buyer-dashboard")
            } else {
              navigate("/seller-dashboard")
            }
          }, 3000)
        } else {
          setStatus("error")
          setMessage(data.message || "Verification failed")
        }
      } catch (error) {
        setStatus("error")
        setMessage("Network error. Please try again.")
      }
    }

    verifyEmail()
  }, [location, navigate])

  const handleResendEmail = async () => {
    // This would need the email from somewhere - could be passed as query param
    const email = new URLSearchParams(location.search).get("email")
    if (!email) {
      alert("Email address not found. Please try signing up again.")
      return
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/auth/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      )

      const data = await response.json()
      if (response.ok) {
        alert("Verification email sent!")
      } else {
        alert(data.message || "Failed to resend email")
      }
    } catch (error) {
      alert("Network error. Please try again.")
    }
  }

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}
    >
      <div
        style={{
          maxWidth: "500px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.1)",
          padding: "3rem",
          borderRadius: "15px",
          textAlign: "center",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {status === "verifying" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
            <h1 style={{ color: "#fff", marginBottom: "1rem" }}>Verifying Email...</h1>
            <p style={{ color: "#a5a5a5" }}>Please wait while we verify your email address.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
            <h1 style={{ color: "#10b981", marginBottom: "1rem" }}>Email Verified!</h1>
            <p style={{ color: "#a5a5a5", marginBottom: "2rem" }}>{message}</p>

            {userType === "seller" && (
              <div
                style={{
                  background: "rgba(251, 191, 36, 0.1)",
                  border: "1px solid rgba(251, 191, 36, 0.3)",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginBottom: "2rem",
                }}
              >
                <h3 style={{ color: "#f59e0b", marginBottom: "0.5rem" }}>Next Step: Document Verification</h3>
                <p style={{ color: "#a5a5a5", fontSize: "0.9rem" }}>
                  As a seller, you need to complete document verification before you can list properties.
                </p>
              </div>
            )}

            <p style={{ color: "#a5a5a5", fontSize: "0.9rem" }}>Redirecting you to your dashboard in 3 seconds...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❌</div>
            <h1 style={{ color: "#ef4444", marginBottom: "1rem" }}>Verification Failed</h1>
            <p style={{ color: "#a5a5a5", marginBottom: "2rem" }}>{message}</p>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={handleResendEmail}
                style={{
                  background: "linear-gradient(45deg, #2563EB, #1E40AF)",
                  color: "#fff",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Resend Email
              </button>

              <Link
                to="/login"
                style={{
                  background: "transparent",
                  color: "#2563EB",
                  border: "2px solid #2563EB",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "5px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  display: "inline-block",
                }}
              >
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default EmailVerification
