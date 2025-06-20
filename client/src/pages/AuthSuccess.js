"use client"

import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const AuthSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get("token")

    if (token) {
      // Store token in localStorage
      localStorage.setItem("token", token)

      // Redirect to dashboard or home page
      navigate("/dashboard")
    } else {
      // If no token, redirect to login
      navigate("/login")
    }
  }, [location, navigate])

  return (
    <div className="auth-success">
      <h2>Authentication Successful</h2>
      <p>Redirecting...</p>
    </div>
  )
}

export default AuthSuccess
