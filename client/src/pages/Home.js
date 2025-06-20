"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"
import Login from "./Login"
import Signup from "./Signup"

const Home = () => {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const handleProtectedClick = (path) => {
    if (isAuthenticated) {
      navigate(path)
    } else {
      navigate('/signup')
    }
  }

  return (
    <div style={{ minHeight: "100vh", paddingTop: "60px", background: "#f8f9fa" }}>
      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          padding: "6rem 2rem",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "3.5rem",
              marginBottom: "1rem",
              fontWeight: "700",
              lineHeight: "1.2",
            }}
          >
            Find Your Dream Home
          </h1>
          <p style={{ fontSize: "1.2rem", marginBottom: "2rem", opacity: 0.9 }}>
            {isAuthenticated
              ? `Welcome back, ${user?.name}! Ready to find your next property?`
              : "Discover the perfect property that matches your lifestyle and budget"}
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => handleProtectedClick("/buy")}
              style={{
                background: "#4169e1",
                color: "#fff",
                padding: "1rem 2rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                border: "none",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              Buy Properties
            </button>
            <button
              onClick={() => handleProtectedClick("/rent")}
              style={{
                background: "transparent",
                color: "#fff",
                padding: "1rem 2rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                border: "2px solid #fff",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              Rent Properties
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "6rem 2rem", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              marginBottom: "3rem",
              color: "#1a1a2e",
              fontSize: "2.5rem",
              fontWeight: "700",
            }}
          >
            Why Choose Us?
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            <FeatureCard
              icon="🏠"
              title="Wide Selection"
              description="Browse thousands of properties from apartments to luxury homes"
            />
            <FeatureCard
              icon="💰"
              title="Best Prices"
              description="Competitive pricing and transparent fees with no hidden costs"
            />
            <FeatureCard
              icon="🔒"
              title="Secure Transactions"
              description="Safe and secure payment processing with buyer protection"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section
          style={{
            padding: "4rem 2rem",
            background: "#4169e1",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h2 style={{ color: "#fff", marginBottom: "1rem", fontSize: "2rem" }}>Ready to Get Started?</h2>
            <p style={{ color: "#fff", marginBottom: "2rem", opacity: 0.9 }}>
              Join thousands of users who have found their perfect home with us
            </p>
            <Link
              to="/signup"
              style={{
                background: "#fff",
                color: "#4169e1",
                padding: "1rem 2rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Sign Up Now
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

const FeatureCard = ({ icon, title, description }) => (
  <div
    style={{
      background: "#f8f9fa",
      padding: "2rem",
      borderRadius: "16px",
      textAlign: "center",
      transition: "transform 0.3s ease",
      border: "1px solid rgba(0, 0, 0, 0.05)",
    }}
  >
    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{icon}</div>
    <h3 style={{ color: "#1a1a2e", marginBottom: "1rem", fontSize: "1.25rem", fontWeight: "600" }}>{title}</h3>
    <p style={{ color: "#666", lineHeight: "1.6" }}>{description}</p>
  </div>
)

export default Home
