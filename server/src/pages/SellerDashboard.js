"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const SellerDashboard = () => {
  const { user } = useAuth()
  const [myProperties, setMyProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalViews: 0,
    totalInquiries: 0,
  })

  useEffect(() => {
    fetchMyProperties()
  }, [])

  const fetchMyProperties = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/properties")
      if (response.ok) {
        const data = await response.json()
        // In a real app, you'd filter by the current user's properties
        // For now, we'll show all properties as if they belong to the seller
        setMyProperties(data.properties || [])

        // Calculate stats
        const properties = data.properties || []
        setStats({
          totalListings: properties.length,
          activeListings: properties.filter((p) => p.status === "for-sale" || p.status === "for-rent").length,
          totalViews: properties.reduce((sum, p) => sum + (p.views || 0), 0),
          totalInquiries: properties.reduce((sum, p) => sum + (p.inquiries || 0), 0),
        })
      }
    } catch (error) {
      console.error("Error fetching properties:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Welcome Section */}
        <div
          style={{
            background: "rgba(34, 197, 94, 0.1)",
            padding: "2rem",
            borderRadius: "10px",
            marginBottom: "2rem",
            border: "1px solid rgba(34, 197, 94, 0.2)",
          }}
        >
          <h1 style={{ color: "#fff", marginBottom: "0.5rem" }}>Welcome back, {user?.name}! 💼</h1>
          <p style={{ color: "#a5a5a5", fontSize: "1.1rem" }}>
            Manage your property listings and track your sales performance.
          </p>
        </div>

        {/* Stats Dashboard */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <StatCard title="Total Listings" value={stats.totalListings} icon="🏠" color="#2563EB" />
          <StatCard title="Active Listings" value={stats.activeListings} icon="✅" color="#22C55E" />
          <StatCard title="Total Views" value={stats.totalViews} icon="👁️" color="#F59E0B" />
          <StatCard title="Inquiries" value={stats.totalInquiries} icon="💬" color="#EF4444" />
        </div>

        {/* Quick Actions */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            padding: "1.5rem",
            borderRadius: "10px",
            marginBottom: "2rem",
          }}
        >
          <h3 style={{ color: "#fff", marginBottom: "1rem" }}>Quick Actions</h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              to="/sell"
              style={{
                background: "linear-gradient(45deg, #22C55E, #16A34A)",
                color: "#fff",
                padding: "0.75rem 1.5rem",
                borderRadius: "5px",
                textDecoration: "none",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              ➕ Add New Property
            </Link>
            <Link
              to="/analytics"
              style={{
                background: "transparent",
                color: "#22C55E",
                padding: "0.75rem 1.5rem",
                borderRadius: "5px",
                textDecoration: "none",
                fontWeight: "bold",
                border: "2px solid #22C55E",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              📊 View Analytics
            </Link>
            <Link
              to="/pricing-tools"
              style={{
                background: "transparent",
                color: "#F59E0B",
                padding: "0.75rem 1.5rem",
                borderRadius: "5px",
                textDecoration: "none",
                fontWeight: "bold",
                border: "2px solid #F59E0B",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              💰 Pricing Tools
            </Link>
          </div>
        </div>

        {/* My Properties */}
        <div>
          <div
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}
          >
            <h2 style={{ color: "#fff" }}>My Properties ({myProperties.length})</h2>
            <Link
              to="/sell"
              style={{
                background: "linear-gradient(45deg, #22C55E, #16A34A)",
                color: "#fff",
                padding: "0.5rem 1rem",
                borderRadius: "5px",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              + Add Property
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", color: "#a5a5a5", padding: "2rem" }}>Loading your properties...</div>
          ) : myProperties.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "10px",
              }}
            >
              <h3 style={{ color: "#fff", marginBottom: "1rem" }}>No Properties Listed Yet</h3>
              <p style={{ color: "#a5a5a5", marginBottom: "2rem" }}>
                Start by adding your first property to reach potential buyers.
              </p>
              <Link
                to="/sell"
                style={{
                  background: "linear-gradient(45deg, #22C55E, #16A34A)",
                  color: "#fff",
                  padding: "1rem 2rem",
                  borderRadius: "5px",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                List Your First Property
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {myProperties.map((property) => (
                <SellerPropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>

        {/* Seller Tips */}
        <div
          style={{
            marginTop: "3rem",
            padding: "2rem",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "10px",
          }}
        >
          <h3 style={{ color: "#fff", marginBottom: "1rem" }}>💡 Seller Tips</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
            <TipCard
              title="High-Quality Photos"
              description="Properties with professional photos get 40% more views"
              icon="📸"
            />
            <TipCard
              title="Competitive Pricing"
              description="Use our pricing tools to set the right market price"
              icon="💰"
            />
            <TipCard title="Detailed Descriptions" description="Include all amenities and unique features" icon="📝" />
          </div>
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ title, value, icon, color }) => (
  <div
    style={{
      background: "rgba(255, 255, 255, 0.05)",
      padding: "1.5rem",
      borderRadius: "8px",
      textAlign: "center",
      border: `1px solid ${color}20`,
    }}
  >
    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{icon}</div>
    <h3 style={{ color, fontSize: "2rem", marginBottom: "0.5rem" }}>{value}</h3>
    <p style={{ color: "#a5a5a5", fontSize: "0.9rem" }}>{title}</p>
  </div>
)

const SellerPropertyCard = ({ property }) => (
  <div
    style={{
      background: "rgba(255, 255, 255, 0.05)",
      borderRadius: "10px",
      overflow: "hidden",
      border: "1px solid rgba(255, 255, 255, 0.1)",
    }}
  >
    <div style={{ position: "relative" }}>
      <img
        src={property.images?.[0] ? `http://localhost:5001${property.images[0]}` : "/images/property1.jpg"}
        alt={property.title}
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
        onError={(e) => {
          e.target.src = "/images/property1.jpg"
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: property.status === "for-sale" ? "#22C55E" : "#F59E0B",
          color: "#fff",
          padding: "0.25rem 0.75rem",
          borderRadius: "15px",
          fontSize: "0.8rem",
        }}
      >
        {property.status === "for-sale" ? "For Sale" : "For Rent"}
      </div>
    </div>
    <div style={{ padding: "1.5rem" }}>
      <h3 style={{ color: "#fff", marginBottom: "0.5rem", fontSize: "1.1rem" }}>{property.title}</h3>
      <p style={{ color: "#a5a5a5", marginBottom: "1rem", fontSize: "0.9rem" }}>📍 {property.location}</p>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <span style={{ color: "#22C55E", fontWeight: "bold" }}>₹{property.price.toLocaleString()}</span>
        <span style={{ color: "#a5a5a5", fontSize: "0.8rem" }}>{property.views || 0} views</span>
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          style={{
            flex: 1,
            background: "linear-gradient(45deg, #2563EB, #1E40AF)",
            color: "#fff",
            border: "none",
            padding: "0.5rem",
            borderRadius: "5px",
            fontSize: "0.8rem",
            cursor: "pointer",
          }}
        >
          Edit
        </button>
        <button
          style={{
            flex: 1,
            background: "transparent",
            color: "#EF4444",
            border: "1px solid #EF4444",
            padding: "0.5rem",
            borderRadius: "5px",
            fontSize: "0.8rem",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)

const TipCard = ({ title, description, icon }) => (
  <div style={{ padding: "1rem", background: "rgba(255, 255, 255, 0.02)", borderRadius: "8px" }}>
    <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{icon}</div>
    <h4 style={{ color: "#fff", marginBottom: "0.5rem", fontSize: "0.9rem" }}>{title}</h4>
    <p style={{ color: "#a5a5a5", fontSize: "0.8rem", lineHeight: "1.4" }}>{description}</p>
  </div>
)

export default SellerDashboard
