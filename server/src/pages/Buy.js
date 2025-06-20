"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../styles/Buy.css"

const Buy = () => {
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProperties()
  }, [])

  const fetchFeaturedProperties = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/properties?limit=6&status=for-sale")
      if (response.ok) {
        const data = await response.json()
        setFeaturedProperties(data.properties || [])
      }
    } catch (error) {
      console.error("Error fetching properties:", error)
    } finally {
      setLoading(false)
    }
  }

  const guides = [
    {
      icon: "🏠",
      title: "First-Time Buyer Guide",
      description: "Everything you need to know about buying your first home, from financing to closing.",
      link: "/guides/first-time-buyer",
    },
    {
      icon: "💰",
      title: "Financing Options",
      description: "Explore different mortgage types, down payment assistance, and loan programs.",
      link: "/guides/financing",
    },
    {
      icon: "🔍",
      title: "Home Inspection",
      description: "Learn what to look for during inspections and how to negotiate repairs.",
      link: "/guides/inspection",
    },
    {
      icon: "📋",
      title: "Legal Process",
      description: "Understand contracts, closing procedures, and legal requirements.",
      link: "/guides/legal",
    },
  ]

  const benefits = [
    {
      icon: "🏡",
      title: "Build Equity",
      description: "Every payment builds ownership and wealth over time.",
    },
    {
      icon: "🔒",
      title: "Stability",
      description: "Enjoy the security and stability of homeownership.",
    },
    {
      icon: "💎",
      title: "Investment",
      description: "Real estate historically appreciates in value over time.",
    },
    {
      icon: "🎨",
      title: "Customization",
      description: "Make it your own with renovations and improvements.",
    },
  ]

  return (
    <div className="buy-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Dream Home</h1>
          <p>Discover thousands of properties for sale in prime locations across the country</p>
          <div className="hero-buttons">
            <Link to="/properties" className="primary-btn">
              Browse Properties
            </Link>
            <Link to="/mortgage-calculator" className="secondary-btn">
              Calculate Mortgage
            </Link>
          </div>
        </div>
      </section>

      {/* Buying Guides */}
      <section className="guides-section">
        <div className="container">
          <h2>Buying Guides</h2>
          <div className="guides-grid">
            {guides.map((guide, index) => (
              <Link key={index} to={guide.link} className="guide-card">
                <i>{guide.icon}</i>
                <h3>{guide.title}</h3>
                <p>{guide.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="featured-properties">
        <div className="container">
          <h2>Featured Properties</h2>
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>Loading properties...</div>
          ) : (
            <>
              <div className="properties-grid">
                {featuredProperties.slice(0, 6).map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
              <div className="view-all">
                <Link to="/properties" className="view-all-button">
                  View All Properties
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Why Buy Section */}
      <section className="why-buy">
        <div className="container">
          <h2 style={{ textAlign: "center", marginBottom: "3rem", color: "#333" }}>Why Buy a Home?</h2>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit">
                <i>{benefit.icon}</i>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const PropertyCard = ({ property }) => (
  <div className="property-card">
    <div className="property-image">
      <img
        src={
          property.images?.[0] ? `http://localhost:5001${property.images[0]}` : "/placeholder.svg?height=200&width=300"
        }
        alt={property.title}
        onError={(e) => {
          e.target.src = "/placeholder.svg?height=200&width=300"
        }}
      />
      <div className="property-price">${property.price.toLocaleString()}</div>
    </div>
    <div className="property-details">
      <h3>{property.title}</h3>
      <div className="location">
        <i>📍</i>
        <span>{property.location}</span>
      </div>
      <div className="features">
        <span>🛏️ {property.bedrooms} Beds</span>
        <span>🚿 {property.bathrooms} Baths</span>
        <span>📐 {property.area} sqft</span>
      </div>
      <Link to={`/properties/${property._id}`} className="view-property">
        View Details
      </Link>
    </div>
  </div>
)

export default Buy
