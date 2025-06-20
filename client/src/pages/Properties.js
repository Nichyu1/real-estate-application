import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Properties.css';

const Properties = () => {
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
        status: '',
        yearBuilt: '',
        features: []
    });

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/properties');
            if (!response.ok) {
                throw new Error('Failed to fetch properties');
            }
            const data = await response.json();
            setProperties(data.properties || []);
            setError(null);
        } catch (err) {
            console.error('Error:', err);
            setError('Error fetching properties: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

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
            status: '',
            yearBuilt: '',
            features: []
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
            (!filters.status || property.status === filters.status) &&
            (!filters.yearBuilt || property.yearBuilt >= parseInt(filters.yearBuilt))
        );
    });

  return (
        <div className="properties-page">
            <section className="search-section">
                <div className="search-container">
                    <h1>Find Your Perfect Property</h1>
                    <div className="filters-container">
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
                                <label>Status</label>
                                <select
                                    name="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">All Properties</option>
                                    <option value="for-sale">For Sale</option>
                                    <option value="for-rent">For Rent</option>
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
    </div>
            </section>

            <section className="properties-section">
                <div className="properties-grid">
                    {loading ? (
                        <div className="loading-message">Loading properties...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : filteredProperties.length === 0 ? (
                        <div className="no-properties">
                            <h3>No properties found</h3>
                            <p>Try adjusting your filters to see more results</p>
                        </div>
                    ) : (
                        filteredProperties.map(property => (
                            <div key={property._id} className="property-card">
                                <Link to={`/property/${property._id}`} className="property-link">
                                    <div className="property-image">
                                        <img
                                            src={property.images && property.images.length > 0 ? 
                                                `http://localhost:5001${property.images[0]}` : 
                                                '/images/property1.jpg'}
                                            alt={property.title || 'Property'}
                                            onError={e => { e.target.src = '/images/property1.jpg'; }}
                                        />
                                        <div className={`property-badge ${property.status === 'for-sale' ? 'for-sale' : 'for-rent'}`}>
                                            {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                                        </div>
                                        <div className="property-price">
                                            ₹{property.price.toLocaleString()}
                                            {property.status === 'for-rent' && '/month'}
                                        </div>
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
                                    </div>
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default Properties;