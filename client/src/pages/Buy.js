import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../constants/assets';
import '../styles/Buy.css';

const Buy = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const buyingGuides = [
        {
            id: 1,
            title: "First-Time Home Buyer's Guide",
            description: "Everything you need to know about buying your first home",
            icon: "fa-home",
            link: "/buying-guide"
        },
        {
            id: 2,
            title: "Mortgage Calculator",
            description: "Calculate your monthly payments and interest rates",
            icon: "fa-calculator",
            link: "/mortgage-calculator"
        },
        {
            id: 3,
            title: "Property Inspection Tips",
            description: "What to look for when inspecting a property",
            icon: "fa-search",
            link: "/inspection-guide"
        }
    ];

    const featuredProperties = [
        {
            id: 1,
            title: "Luxury Beachfront Villa",
            price: 1200000,
            location: "Miami Beach, FL",
            image: IMAGES.LUXURY_VILLA,
            features: ["5 Beds", "4 Baths", "4,500 sqft"]
        },
        {
            id: 2,
            title: "Modern City Penthouse",
            price: 850000,
            location: "Downtown LA",
            image: IMAGES.PENTHOUSE,
            features: ["3 Beds", "3 Baths", "2,800 sqft"]
        }
    ];

    const fetchProperties = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/properties');
            if (!response.ok) {
                throw new Error('Failed to fetch properties');
            }
            const data = await response.json();
            setProperties(data.properties || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchProperties();
    }, []);

    // Set up periodic refresh
    useEffect(() => {
        const refreshInterval = setInterval(fetchProperties, 30000); // Refresh every 30 seconds
        return () => clearInterval(refreshInterval);
    }, []);

    const openModal = (property) => {
        setSelectedProperty(property);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProperty(null);
    };

    if (loading) {
        return <div className="loading">Loading properties...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="buy-page">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Find Your Dream Home</h1>
                    <p>Discover amazing properties in prime locations across the country</p>
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

            <section className="guides-section">
                <div className="container">
                    <h2>Buying Resources</h2>
                    <div className="guides-grid">
                        {buyingGuides.map(guide => (
                            <Link to={guide.link} key={guide.id} className="guide-card">
                                <i className={`fas ${guide.icon}`}></i>
                                <h3>{guide.title}</h3>
                                <p>{guide.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="properties-section">
                <div className="container">
                    <h2>Properties for Sale</h2>
                    {properties.length === 0 ? (
                        <div className="no-properties">
                            <p>No properties available at the moment.</p>
                        </div>
                    ) : (
                        <div className="properties-grid">
                            {properties
                                .filter(property => property.status === 'for-sale')
                                .map(property => (
                                    <div key={property._id} className="property-card">
                                        <div className="property-image" style={{height: '220px', overflow: 'hidden', position: 'relative'}}>
                                            <img
                                                src={property.images && property.images.length > 0 ? (property.images[0].startsWith('http') ? property.images[0] : `http://localhost:5001${property.images[0]}`) : '/images/property1.jpg'}
                                                alt={property.title || 'Property'}
                                                style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                onError={e => { e.target.src = '/images/property1.jpg'; }}
                                            />
                                            <div className="property-badge for-sale">FOR SALE</div>
                                            <div className="property-price">₹{property.price?.toLocaleString()}</div>
                                        </div>
                                        <div className="property-info">
                                            <h3>{property.title || 'No Title'}</h3>
                                            <p className="location">
                                                <i className="fas fa-map-marker-alt"></i> {property.location}
                                            </p>
                                            <div className="property-specs">
                                                <span>{property.bedrooms} Beds</span>
                                                <span>{property.bathrooms} Baths</span>
                                                <span>{property.area} sqft</span>
                                            </div>
                                            <div className="property-features">
                                                {property.features?.slice(0, 3).map((feature, index) => (
                                                    <span key={index} className="feature-tag">{feature}</span>
                                                ))}
                                            </div>
                                            <button className="view-property" onClick={() => openModal(property)}>
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="why-buy">
                <div className="container">
                    <h2>Why Buy With Us?</h2>
                    <div className="benefits-grid">
                        <div className="benefit">
                            <i className="fas fa-shield-alt"></i>
                            <h3>Trusted Agents</h3>
                            <p>Work with experienced professionals who put your interests first</p>
                        </div>
                        <div className="benefit">
                            <i className="fas fa-hand-holding-usd"></i>
                            <h3>Best Deals</h3>
                            <p>Access to exclusive properties and competitive prices</p>
                        </div>
                        <div className="benefit">
                            <i className="fas fa-clock"></i>
                            <h3>24/7 Support</h3>
                            <p>Round-the-clock assistance for all your queries</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal for property details */}
            {showModal && selectedProperty && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={closeModal}>&times;</button>
                        <h2>{selectedProperty.title}</h2>
                        <img
                            src={selectedProperty.images && selectedProperty.images.length > 0 ? (selectedProperty.images[0].startsWith('http') ? selectedProperty.images[0] : `http://localhost:5001${selectedProperty.images[0]}`) : '/images/property1.jpg'}
                            alt={selectedProperty.title || 'Property'}
                            style={{width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px'}}
                        />
                        <div className="modal-details">
                            <p><strong>Price:</strong> ₹{selectedProperty.price?.toLocaleString()}</p>
                            <p><strong>Location:</strong> {selectedProperty.location}</p>
                            <p><strong>Area:</strong> {selectedProperty.area} sqft</p>
                            <p><strong>Bedrooms:</strong> {selectedProperty.bedrooms}</p>
                            <p><strong>Bathrooms:</strong> {selectedProperty.bathrooms}</p>
                            <p><strong>Features:</strong> {selectedProperty.features?.join(', ')}</p>
                            <hr />
                            <h4>Seller Details</h4>
                            <p><strong>Name:</strong> {selectedProperty.contactInfo?.name}</p>
                            <p><strong>Email:</strong> {selectedProperty.contactInfo?.email}</p>
                            <p><strong>Phone:</strong> {selectedProperty.contactInfo?.phone}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Buy; 