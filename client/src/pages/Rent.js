import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Rent.css';

const Rent = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        priceRange: '',
        propertyType: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        location: '',
        yearBuilt: ''
    });
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/properties?status=for-rent');
                if (!response.ok) {
                    throw new Error('Failed to fetch properties');
                }
                const data = await response.json();
                setProperties(data.properties || []);
            } catch (err) {
                console.error('Error fetching properties:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            priceRange: '',
            propertyType: '',
            bedrooms: '',
            bathrooms: '',
            area: '',
            location: '',
            yearBuilt: ''
        });
    };

    const filteredProperties = properties.filter(property => {
        return (
            (!filters.priceRange || property.price <= parseInt(filters.priceRange)) &&
            (!filters.propertyType || property.type.toLowerCase() === filters.propertyType.toLowerCase()) &&
            (!filters.bedrooms || property.bedrooms >= parseInt(filters.bedrooms)) &&
            (!filters.bathrooms || property.bathrooms >= parseInt(filters.bathrooms)) &&
            (!filters.area || property.area >= parseInt(filters.area)) &&
            (!filters.location || property.location.toLowerCase().includes(filters.location.toLowerCase())) &&
            (!filters.yearBuilt || property.yearBuilt >= parseInt(filters.yearBuilt))
        );
    });

    const openModal = (property) => {
        setSelectedProperty(property);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProperty(null);
    };

    return (
        <div className="rent-page">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Find Your Perfect Rental</h1>
                    <p>Browse through our selection of properties for rent</p>
                </div>
            </section>

            <section className="filters-section">
                <div className="container">
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label>Price Range</label>
                            <select
                                name="priceRange"
                                value={filters.priceRange}
                                onChange={handleFilterChange}
                            >
                                <option value="">Any Price</option>
                                <option value="500000">Under ₹5,00,000</option>
                                <option value="1000000">Under ₹10,00,000</option>
                                <option value="2000000">Under ₹20,00,000</option>
                                <option value="5000000">Under ₹50,00,000</option>
                                <option value="10000000">Under ₹1,00,00,000</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Property Type</label>
                            <select
                                name="propertyType"
                                value={filters.propertyType}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Types</option>
                                <option value="house">House</option>
                                <option value="apartment">Apartment</option>
                                <option value="villa">Villa</option>
                                <option value="penthouse">Penthouse</option>
                                <option value="land">Land</option>
                                <option value="cabin">Cabin</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Bedrooms</label>
                            <select
                                name="bedrooms"
                                value={filters.bedrooms}
                                onChange={handleFilterChange}
                            >
                                <option value="">Any</option>
                                <option value="1">1+</option>
                                <option value="2">2+</option>
                                <option value="3">3+</option>
                                <option value="4">4+</option>
                                <option value="5">5+</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Bathrooms</label>
                            <select
                                name="bathrooms"
                                value={filters.bathrooms}
                                onChange={handleFilterChange}
                            >
                                <option value="">Any</option>
                                <option value="1">1+</option>
                                <option value="2">2+</option>
                                <option value="3">3+</option>
                                <option value="4">4+</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Area (sq ft)</label>
                            <select
                                name="area"
                                value={filters.area}
                                onChange={handleFilterChange}
                            >
                                <option value="">Any</option>
                                <option value="500">500+</option>
                                <option value="1000">1000+</option>
                                <option value="2000">2000+</option>
                                <option value="3000">3000+</option>
                                <option value="5000">5000+</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Year Built</label>
                            <select
                                name="yearBuilt"
                                value={filters.yearBuilt}
                                onChange={handleFilterChange}
                            >
                                <option value="">Any</option>
                                <option value="2020">2020+</option>
                                <option value="2015">2015+</option>
                                <option value="2010">2010+</option>
                                <option value="2000">2000+</option>
                                <option value="1990">1990+</option>
                            </select>
                        </div>

                        <div className="filter-group full-width">
                            <label>Location</label>
                            <input
                                type="text"
                                name="location"
                                placeholder="Enter location"
                                value={filters.location}
                                onChange={handleFilterChange}
                            />
                        </div>
                    </div>

                    <div className="filter-actions">
                        <button className="clear-filters" onClick={clearFilters}>
                            Clear Filters
                        </button>
                        <div className="results-count">
                            {filteredProperties.length} properties found
                        </div>
                    </div>
                </div>
            </section>

            <section className="properties-section">
                <div className="container">
                    {loading && <div className="loading">Loading properties...</div>}
                    {error && <div className="error">Error: {error}</div>}
                    <div className="properties-grid">
                        {filteredProperties.map(property => (
                            <div key={property._id} className="property-card">
                                <div className="property-image" style={{height: '220px', overflow: 'hidden', position: 'relative'}}>
                                    <img
                                        src={property.images && property.images.length > 0 ? (property.images[0].startsWith('http') ? property.images[0] : `http://localhost:5001${property.images[0]}`) : '/images/property1.jpg'}
                                        alt={property.title || 'Property'}
                                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                        onError={e => { e.target.src = '/images/property1.jpg'; }}
                                    />
                                    <div className="property-badge for-rent">FOR RENT</div>
                                    <div className="property-price">₹{property.price?.toLocaleString()}/month</div>
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
                            <p><strong>Price:</strong> ₹{selectedProperty.price?.toLocaleString()}/month</p>
                            <p><strong>Location:</strong> {selectedProperty.location}</p>
                            <p><strong>Area:</strong> {selectedProperty.area} sqft</p>
                            <p><strong>Bedrooms:</strong> {selectedProperty.bedrooms}</p>
                            <p><strong>Bathrooms:</strong> {selectedProperty.bathrooms}</p>
                            <p><strong>Features:</strong> {selectedProperty.features?.join(', ')}</p>
                            <hr />
                            <h4>Contact Info</h4>
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

export default Rent; 