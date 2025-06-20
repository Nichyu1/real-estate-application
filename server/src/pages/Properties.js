"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import "../styles/Properties.css"

const Properties = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    location: "",
  })

  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    fetchProperties()
  }, [filters])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") {
          queryParams.append(key, value)
        }
      })

      const response = await fetch(`http://localhost:5001/api/properties?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setProperties(data.properties || [])
      } else {
        setError("Failed to fetch properties")
      }
    } catch (error) {
      console.error("Error fetching properties:", error)
      setError("Error loading properties")
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return
    }

    try {
      const response = await fetch(`http://localhost:5001/api/properties/${propertyId}`, {
        method: "DELETE",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      })

      if (response.ok) {
        setProperties((prev) => prev.filter((p) => p._id !== propertyId))
      } else {
        alert("Failed to delete property")
      }
    } catch (error) {
      console.error("Error deleting property:", error)
      alert("Error deleting property")
    }
  }

  if (loading) {
    return <div className="loading">Loading properties...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="properties-page">
      {/* Search Section */}
      <section className="search-section">
        <div className="search-container">
          <h1>Find Your Perfect Property</h1>
          <div className="filters">
            <select value={filters.type} onChange={(e) => handleFilterChange("type", e.target.value)}>
              <option value="all">All Types</option>
              <option value="house">Houses</option>
              <option value="apartment">Apartments</option>
              <option value="villa">Villas</option>
              <option value="land">Land</option>
            </select>

            <select value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)}>
              <option value="all">All Status</option>
              <option value="for-sale">For Sale</option>
              <option value="for-rent">For Rent</option>
            </select>

            <input
              type="text"
              placeholder="Location..."
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              style={{
                padding: "1rem 2rem",
                border: "none",
                borderRadius: "12px",
                fontSize: "1.1rem",
                minWidth: "250px",
              }}
            />

            <select value={filters.bedrooms} onChange={(e) => handleFilterChange("bedrooms", e.target.value)}>
              <option value="">Any Bedrooms</option>
              <option value="1">1+ Bedrooms</option>
              <option value="2">2+ Bedrooms</option>
              <option value="3">3+ Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <div className="properties-grid">
        {properties.length === 0 ? (
          <div className="no-properties">
            <h3>No properties found</h3>
            <p>Try adjusting your search filters</p>
          </div>
        ) : (
          properties.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              onDelete={handleDeleteProperty}
              canDelete={isAuthenticated && user && (user.id === property.owner || user.role === "admin")}
            />
          ))
        )}
      </div>
    </div>
  )
}

const PropertyCard = ({ property, onDelete, canDelete }) => (
  <div className="property-card">
    <div className="property-image">
      <img
        src={
          property.images?.[0] ? `http://localhost:5001${property.images[0]}` : "/placeholder.svg?height=250&width=350"
        }
        alt={property.title}
        onError={(e) => {
          e.target.src = "/placeholder.svg?height=250&width=350"
        }}
      />
      <div className="property-price">${property.price.toLocaleString()}</div>
      <div className="property-type">{property.type}</div>
    </div>
    <div className="property-details">
      <h3>{property.title}</h3>
      <div className="location">
        <i className="fas fa-map-marker-alt"></i>
        <span>{property.location}</span>
      </div>
      <div className="property-features">
        <span>
          <i className="fas fa-bed"></i>
          {property.bedrooms} Beds
        </span>
        <span>
          <i className="fas fa-bath"></i>
          {property.bathrooms} Baths
        </span>
        <span>
          <i className="fas fa-ruler-combined"></i>
          {property.area} sqft
        </span>
      </div>
      <div className="property-actions">
        <button className="view-details">View Details</button>
        {canDelete && (
          <button className="delete-property" onClick={() => onDelete(property._id)}>
            Delete
          </button>
        )}
      </div>
    </div>
  </div>
)

export default Properties
