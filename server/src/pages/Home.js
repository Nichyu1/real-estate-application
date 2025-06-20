"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Home = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
          padding: "4rem 2rem",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              background: "linear-gradient(45deg, #fff, #a5a5a5)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Find Your Dream Home
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              marginBottom: "2rem",
              color: "#a5a5a5",
            }}
          >
            {isAuthenticated
              ? `Welcome back, ${user?.name}! Ready to find your next property?`
              : "Discover the perfect property that matches your lifestyle and budget"}
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/buy"
              style={{
                background: "linear-gradient(45deg, #2563EB, #1E40AF)",
                color: "#fff",
                padding: "1rem 2rem",
                borderRadius: "5px",
                textDecoration: "none",
                fontWeight: "bold",
                transition: "all 0.3s ease",
              }}
            >
              Buy Properties
            </Link>
            <Link
              to="/rent"
              style={{
                background: "transparent",
                color: "#fff",
                padding: "1rem 2rem",
                borderRadius: "5px",
                textDecoration: "none",
                fontWeight: "bold",
                border: "2px solid #2563EB",
                transition: "all 0.3s ease",
              }}
            >
              Rent Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "4rem 2rem", background: "rgba(0, 0, 0, 0.8)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              marginBottom: "3rem",
              color: "#fff",
              fontSize: "2.5rem",
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
            background: "linear-gradient(45deg, #2563EB, #1E40AF)",
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
                color: "#2563EB",
                padding: "1rem 2rem",
                borderRadius: "5px",
                textDecoration: "none",
                fontWeight: "bold",
                transition: "all 0.3s ease",
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
      background: "rgba(255, 255, 255, 0.05)",
      padding: "2rem",
      borderRadius: "10px",
      textAlign: "center",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
    }}
  >
    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{icon}</div>
    <h3 style={{ color: "#fff", marginBottom: "1rem" }}>{title}</h3>
    <p style={{ color: "#a5a5a5", lineHeight: "1.6" }}>{description}</p>
  </div>
)

export default Home
