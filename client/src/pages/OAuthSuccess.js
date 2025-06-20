"use client"

import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

const OAuthSuccess = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      localStorage.setItem("token", token)
      setTimeout(() => navigate("/"), 2000)
    } else {
      navigate("/login")
    }
  }, [searchParams, navigate])

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: "#fff" }}>
        <h2>Authentication Successful!</h2>
        <p>Redirecting...</p>
      </div>
    </div>
  )
}

export default OAuthSuccess
