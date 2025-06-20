"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
// import heroimg from "../assets/images/sell-hero.jpg"
import "../styles/Sell.css"

const Sell = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    type: "house",
    status: "for-sale",
    bedrooms: "",
    bathrooms: "",
    area: "",
    yearBuilt: "",
    features: "",
    amenities: "",
    contactName: user?.name || "",
    contactEmail: user?.email || "",
    contactPhone: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const propertyData = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        area: Number(formData.area),
        yearBuilt: formData.yearBuilt ? Number(formData.yearBuilt) : undefined,
        features: formData.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
        amenities: formData.amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        contactInfo: {
          name: formData.contactName,
          email: formData.contactEmail,
          phone: formData.contactPhone,
        },
      }

      const response = await fetch("http://localhost:5001/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(propertyData),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Property listed successfully!")
        navigate("/seller-dashboard")
      } else {
        setError(data.message || "Failed to create property listing")
      }
    } catch (error) {
      console.error("Error creating property:", error)
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const benefits = [
    {
      icon: "💰",
      title: "Maximum Exposure",
      description: "Reach thousands of potential buyers through our platform and partner networks.",
    },
    {
      icon: "📊",
      title: "Market Analytics",
      description: "Get detailed insights about your property's performance and market trends.",
    },
    {
      icon: "🏆",
      title: "Professional Support",
      description: "Our team of experts will guide you through every step of the selling process.",
    },
    {
      icon: "⚡",
      title: "Quick Listing",
      description: "List your property in minutes with our streamlined process.",
    },
  ]

  return (
    <div style={{
      backgroundImage:{img}
    }} className="sell-page">
      {/* Hero Section */}
      <section className="sell-hero">
        <div className="hero-content">
          <h1>Sell Your Property</h1>
          <p>List your property and connect with qualified buyers in your area</p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <h2>Why Sell With Us?</h2>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <i>{benefit.icon}</i>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Listing Form */}
      <section className="listing-form">
        <div className="container">
          <h2>List Your Property</h2>
          {error && (
            <div
              style={{
                color: "red",
                textAlign: "center",
                marginBottom: "1rem",
                padding: "1rem",
                background: "#fff5f5",
                borderRadius: "8px",
              }}
            >
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label>Property Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Beautiful 3BR House with Garden"
              />
            </div>

            <div className="form-group">
              <label>Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="e.g., 500000"
              />
            </div>

            <div className="form-group">
              <label>Property Type *</label>
              <select name="type" value={formData.type} onChange={handleChange} required>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Penthouse</option>
                <option value="land">Land</option>
                <option value="cabin">Cabin</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select name="status" value={formData.status} onChange={handleChange} required>
                <option value="for-sale">For Sale</option>
                <option value="for-rent">For Rent</option>
              </select>
            </div>

            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g., Downtown LA, CA"
              />
            </div>

            <div className="form-group">
              <label>Area (sqft) *</label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
                placeholder="e.g., 2000"
              />
            </div>

            <div className="form-group">
              <label>Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                placeholder="e.g., 3"
              />
            </div>

            <div className="form-group">
              <label>Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                placeholder="e.g., 2"
              />
            </div>

            <div className="form-group">
              <label>Year Built</label>
              <input
                type="number"
                name="yearBuilt"
                value={formData.yearBuilt}
                onChange={handleChange}
                placeholder="e.g., 2020"
              />
            </div>

            <div className="form-group">
              <label>Contact Phone *</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                required
                placeholder="e.g., +1-555-0123"
              />
            </div>

            <div className="form-group full-width">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe your property in detail..."
              />
            </div>

            <div className="form-group full-width">
              <label>Features (comma-separated)</label>
              <input
                type="text"
                name="features"
                value={formData.features}
                onChange={handleChange}
                placeholder="e.g., Garage, Garden, Modern Kitchen, Fireplace"
              />
            </div>

            <div className="form-group full-width">
              <label>Amenities (comma-separated)</label>
              <input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                placeholder="e.g., Swimming Pool, Gym, Security System, Parking"
              />
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Creating Listing..." : "List Property"}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Sell
