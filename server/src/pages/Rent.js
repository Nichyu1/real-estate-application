"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../styles/Rent.css"

const Rent = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    location: "",
  })

  useEffect(() => {
    fetchRentalProperties()
  }, [filters])

  const fetchRentalProperties = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        status: "for-rent",
        limit: "12",
      })

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") {
          queryParams.append(key, value)
        }
      })

      const response = await fetch(`http://localhost:5001/api/properties?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setProperties(data.properties || [])
      }
    } catch (error) {
      console.error("Error fetching rental properties:", error)
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

  const resetFilters = () => {
    setFilters({
      type: "all",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      location: "",
    })
  }

  const rentalGuides = [
    {
      icon: "📋",
      title: "Rental Application",
      description: "Learn how to prepare a strong rental application that gets approved.",
      link: "/guides/rental-application",
    },
    {
      icon: "🔍",
      title: "Property Inspection",
      description: "What to look for when viewing rental properties.",
      link: "/guides/rental-inspection",
    },
    {
      icon: "💰",
      title: "Understanding Costs",
      description: "Security deposits, utilities, and hidden costs explained.",
      link: "/guides/rental-costs",
    },
    {
      icon: "📜",
      title: "Lease Agreement",
      description: "Understanding your rights and responsibilities as a tenant.",
      link: "/guides/lease-agreement",
    },
  ]

  return (
    <div className="rent-page">
      {/* Hero Section */}
      <section className="rent-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Find Your Perfect Rental</h1>
            <p>Discover amazing rental properties in prime locations with flexible lease terms</p>
            <div className="hero-stats">
              <div className="stat">
                <div className="number">500+</div>
                <div className="label">Available Rentals</div>
              </div>
              <div className="stat">
                <div className="number">50+</div>
                <div className="label">Cities</div>
              </div>
              <div className="stat">
                <div className="number">98%</div>
                <div className="label">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Property Type</label>
              <select value={filters.type} onChange={(e) => handleFilterChange("type", e.target.value)}>
                <option value="all">All Types</option>
                <option value="apartment">Apartments</option>
                <option value="house">Houses</option>
                <option value="villa">Villas</option>
                <option value="penthouse">Penthouses</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Location</label>
              <input
                type="text"
                placeholder="Enter city or area"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Bedrooms</label>
              <select value={filters.bedrooms} onChange={(e) => handleFilterChange("bedrooms", e.target.value)}>
                <option value="">Any</option>
                <option value="1">1+ Bedrooms</option>
                <option value="2">2+ Bedrooms</option>
                <option value="3">3+ Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>
            </div>
          </div>

          <div className="filter-actions">
            <button className="reset-btn" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="properties-section">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>Loading rental properties...</div>
          ) : properties.length === 0 ? (
            <div className="no-properties">
              <h3>No rental properties found</h3>
              <p>Try adjusting your search filters or check back later for new listings.</p>
              <button className="reset-btn" onClick={resetFilters}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="properties-grid">
              {properties.map((property) => (
                <RentalPropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Rental Guide Section */}
      <section className="rental-guide">
        <div className="container">
          <h2>Rental Guides & Resources</h2>
          <div className="guide-grid">
            {rentalGuides.map((guide, index) => (
              <div key={index} className="guide-card">
                <div className="guide-icon">{guide.icon}</div>
                <h3>{guide.title}</h3>
                <p>{guide.description}</p>
                <Link to={guide.link} className="guide-link">
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const RentalPropertyCard = ({ property }) => {
  const amenities = property.amenities?.slice(0, 3) || []
  const remainingAmenities = property.amenities?.length > 3 ? property.amenities.length - 3 : 0

  return (
    <div className="property-card">
      <div className="property-image">
        <img
          src={
            property.images?.[0]
              ? `http://localhost:5001${property.images[0]}`
              : "/placeholder.svg?height=250&width=350"
          }
          alt={property.title}
          onError={(e) => {
            e.target.src = "/placeholder.svg?height=250&width=350"
          }}
        />
        <div className="property-badge">For Rent</div>
      </div>
      <div className="property-content">
        <div className="property-header">
          <h3>{property.title}</h3>
          <div className="property-rating">
            <div className="stars">★★★★★</div>
            <span className="rating">4.8</span>
            <span className="reviews">(24)</span>
          </div>
        </div>
        <div className="property-location">
          <i className="fas fa-map-marker-alt"></i>
          <span>{property.location}</span>
        </div>
        <div className="property-details">
          <div className="detail">
            <i className="fas fa-bed"></i>
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="detail">
            <i className="fas fa-bath"></i>
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="detail">
            <i className="fas fa-ruler-combined"></i>
            <span>{property.area} sqft</span>
          </div>
        </div>
        <div className="property-amenities">
          {amenities.map((amenity, index) => (
            <span key={index} className="amenity-tag">
              {amenity}
            </span>
          ))}
          {remainingAmenities > 0 && <span className="amenity-more">+{remainingAmenities} more</span>}
        </div>
        <div className="property-footer">
          <div className="property-price">
            <span className="price">${property.price.toLocaleString()}</span>
            <span className="period">/month</span>
          </div>
          <Link to={`/properties/${property._id}`} className="view-details-btn">
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Rent
