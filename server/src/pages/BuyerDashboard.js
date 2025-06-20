"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const BuyerDashboard = () => {
  const { user } = useAuth()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: "all",
    priceRange: "all",
    location: "",
  })

  useEffect(() => {
    fetchPropertiesForSale()
  }, [])

  const fetchPropertiesForSale = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/properties")
      if (response.ok) {
        const data = await response.json()
        // Filter for properties that are for sale
        const forSaleProperties = data.properties.filter((property) => property.status === "for-sale")
        setProperties(forSaleProperties)
      }
    } catch (error) {
      console.error("Error fetching properties:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProperties = properties.filter((property) => {
    const matchesType = filters.type === "all" || property.type.toLowerCase() === filters.type
    const matchesLocation =
      !filters.location || property.location.toLowerCase().includes(filters.location.toLowerCase())

    let matchesPrice = true
    if (filters.priceRange !== "all") {
      const [min, max] = filters.priceRange.split("-").map(Number)
      matchesPrice = property.price >= min && (max ? property.price <= max : true)
    }

    return matchesType && matchesLocation && matchesPrice
  })

  return (
    <div style={{ minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Welcome Section */}
        <div
          style={{
            background: "rgba(37, 99, 235, 0.1)",
            padding: "2rem",
            borderRadius: "10px",
            marginBottom: "2rem",
            border: "1px solid rgba(37, 99, 235, 0.2)",
          }}
        >
          <h1 style={{ color: "#fff", marginBottom: "0.5rem" }}>Welcome back, {user?.name}! 🏠</h1>
          <p style={{ color: "#a5a5a5", fontSize: "1.1rem" }}>
            Ready to find your dream property? Browse our latest listings below.
          </p>
        </div>

        {/* Quick Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              padding: "1.5rem",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "#2563EB", fontSize: "2rem", marginBottom: "0.5rem" }}>{properties.length}</h3>
            <p style={{ color: "#a5a5a5" }}>Properties Available</p>
          </div>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              padding: "1.5rem",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "#2563EB", fontSize: "2rem", marginBottom: "0.5rem" }}>
              {properties.filter((p) => p.type.toLowerCase() === "house").length}
            </h3>
            <p style={{ color: "#a5a5a5" }}>Houses</p>
          </div>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              padding: "1.5rem",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "#2563EB", fontSize: "2rem", marginBottom: "0.5rem" }}>
              {properties.filter((p) => p.type.toLowerCase() === "land").length}
            </h3>
            <p style={{ color: "#a5a5a5" }}>Land Plots</p>
          </div>
        </div>

        {/* Filters */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            padding: "1.5rem",
            borderRadius: "10px",
            marginBottom: "2rem",
          }}
        >
          <h3 style={{ color: "#fff", marginBottom: "1rem" }}>Filter Properties</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              style={{
                padding: "0.75rem",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "5px",
                color: "#fff",
              }}
            >
              <option value="all">All Types</option>
              <option value="house">Houses</option>
              <option value="land">Land</option>
              <option value="apartment">Apartments</option>
              <option value="villa">Villas</option>
            </select>

            <select
              value={filters.priceRange}
              onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
              style={{
                padding: "0.75rem",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "5px",
                color: "#fff",
              }}
            >
              <option value="all">All Prices</option>
              <option value="0-500000">Under ₹5 Lakh</option>
              <option value="500000-1000000">₹5-10 Lakh</option>
              <option value="1000000-2000000">₹10-20 Lakh</option>
              <option value="2000000-5000000">₹20-50 Lakh</option>
              <option value="5000000">Above ₹50 Lakh</option>
            </select>

            <input
              type="text"
              placeholder="Search by location..."
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              style={{
                padding: "0.75rem",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "5px",
                color: "#fff",
              }}
            />
          </div>
        </div>

        {/* Properties Grid */}
        <div>
          <h2 style={{ color: "#fff", marginBottom: "1.5rem" }}>
            Properties for Sale ({filteredProperties.length} found)
          </h2>

          {loading ? (
            <div style={{ textAlign: "center", color: "#a5a5a5", padding: "2rem" }}>Loading properties...</div>
          ) : filteredProperties.length === 0 ? (
            <div style={{ textAlign: "center", color: "#a5a5a5", padding: "2rem" }}>
              No properties found matching your criteria.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {filteredProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div
          style={{
            marginTop: "3rem",
            padding: "2rem",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: "#fff", marginBottom: "1rem" }}>Need Help Finding the Right Property?</h3>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/mortgage-calculator"
              style={{
                background: "linear-gradient(45deg, #2563EB, #1E40AF)",
                color: "#fff",
                padding: "0.75rem 1.5rem",
                borderRadius: "5px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Calculate Mortgage
            </Link>
            <Link
              to="/contact"
              style={{
                background: "transparent",
                color: "#2563EB",
                padding: "0.75rem 1.5rem",
                borderRadius: "5px",
                textDecoration: "none",
                fontWeight: "bold",
                border: "2px solid #2563EB",
              }}
            >
              Contact Agent
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const PropertyCard = ({ property }) => (
  <div
    style={{
      background: "rgba(255, 255, 255, 0.05)",
      borderRadius: "10px",
      overflow: "hidden",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      transition: "transform 0.3s ease",
    }}
    onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
    onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
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
          background: "linear-gradient(45deg, #2563EB, #1E40AF)",
          color: "#fff",
          padding: "0.5rem 1rem",
          borderRadius: "20px",
          fontWeight: "bold",
        }}
      >
        ₹{property.price.toLocaleString()}
      </div>
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "rgba(0, 0, 0, 0.7)",
          color: "#fff",
          padding: "0.25rem 0.75rem",
          borderRadius: "15px",
          fontSize: "0.8rem",
        }}
      >
        {property.type}
      </div>
    </div>
    <div style={{ padding: "1.5rem" }}>
      <h3 style={{ color: "#fff", marginBottom: "0.5rem", fontSize: "1.1rem" }}>{property.title}</h3>
      <p style={{ color: "#a5a5a5", marginBottom: "1rem", fontSize: "0.9rem" }}>📍 {property.location}</p>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", fontSize: "0.8rem", color: "#a5a5a5" }}>
        <span>🛏️ {property.bedrooms} Beds</span>
        <span>🚿 {property.bathrooms} Baths</span>
        <span>📐 {property.area} sqft</span>
      </div>
      <button
        style={{
          width: "100%",
          background: "linear-gradient(45deg, #2563EB, #1E40AF)",
          color: "#fff",
          border: "none",
          padding: "0.75rem",
          borderRadius: "5px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        View Details
      </button>
    </div>
  </div>
)

export default BuyerDashboard
