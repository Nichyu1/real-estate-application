import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IMAGES } from '../constants/assets';
import heroimg from "../assets/sell-hero.jpg"
import { FaHome, FaBed, FaBath, FaRuler, FaCalendarAlt, FaUpload, FaCheck } from 'react-icons/fa';
import { MdLocationOn, MdDescription, MdAttachMoney } from 'react-icons/md';
import '../styles/Sell.css';

const Sell = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA'
        },
        type: '',
        status: 'for-sale',
        bedrooms: '',
        bathrooms: '',
        area: '',
        yearBuilt: '',
        features: [],
        amenities: [],
        images: [],
        name: '',
        email: '',
        phone: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prevState => ({
                ...prevState,
                [parent]: {
                    ...prevState[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleFeaturesChange = (e) => {
        const features = e.target.value.split(',').map(feature => feature.trim());
        setFormData(prevState => ({
            ...prevState,
            features
        }));
    };

    const handleAmenitiesChange = (e) => {
        const amenities = e.target.value.split(',').map(amenity => amenity.trim());
        setFormData(prevState => ({
            ...prevState,
            amenities
        }));
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        const formData = new FormData();
        
        files.forEach((file) => {
            formData.append('images', file);
        });

        try {
            const response = await fetch('http://localhost:5001/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload images');
            }

            const data = await response.json();
            setFormData(prevState => ({
                ...prevState,
                images: data.imageUrls 
            }));
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Failed to upload images. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Debug log
            console.log('Form Data:', formData);

            // Validate required fields
            const requiredFields = {
                title: formData.title,
                description: formData.description,
                price: formData.price,
                location: formData.location,
                type: formData.type,
                area: formData.area,
                name: formData.name,
                email: formData.email,
                phone: formData.phone
            };

            // Debug log
            console.log('Required Fields:', requiredFields);

            const missingFields = Object.entries(requiredFields)
                .filter(([_, value]) => !value)
                .map(([key]) => key);

            // Debug log
            console.log('Missing Fields:', missingFields);

            if (missingFields.length > 0) {
                throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
            }

            // Validate property type
            const validTypes = ['house', 'apartment', 'villa', 'penthouse', 'land', 'cabin', 'commercial'];
            if (!validTypes.includes(formData.type.toLowerCase())) {
                throw new Error(`Invalid property type. Must be one of: ${validTypes.join(', ')}`);
            }

            // Validate price and area are positive numbers
            if (Number(formData.price) <= 0) {
                throw new Error('Price must be greater than 0');
            }
            if (Number(formData.area) <= 0) {
                throw new Error('Area must be greater than 0');
            }

            // Validate year built if provided
            if (formData.yearBuilt) {
                const currentYear = new Date().getFullYear();
                const yearBuilt = Number(formData.yearBuilt);
                if (yearBuilt < 1800 || yearBuilt > currentYear + 1) {
                    throw new Error(`Year built must be between 1800 and ${currentYear + 1}`);
                }
            }

            const propertyData = {
                title: formData.title,
                description: formData.description,
                price: Number(formData.price),
                location: formData.location,
                address: formData.address,
                type: formData.type.toLowerCase(),
                status: formData.status,
                bedrooms: Number(formData.bedrooms) || 0,
                bathrooms: Number(formData.bathrooms) || 0,
                area: Number(formData.area),
                yearBuilt: formData.yearBuilt ? Number(formData.yearBuilt) : undefined,
                features: formData.features || [],
                amenities: formData.amenities || [],
                images: formData.images || [],
                contactInfo: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                }
            };

            // Debug log
            console.log('Property Data being sent:', propertyData);

            const response = await fetch('http://localhost:5001/api/properties', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify(propertyData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create property listing');
            }

            alert('Property listing created successfully!');
            navigate('/properties');
        } catch (err) {
            console.error('Error submitting form:', err);
            setError(err.message);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const sellerBenefits = [
        {
            icon: "fa-chart-line",
            title: "Maximum Exposure",
            description: "Get your property in front of thousands of qualified buyers through our extensive network and marketing channels."
        },
        {
            icon: "fa-dollar-sign",
            title: "Best Price",
            description: "Our expert agents use market analysis and negotiation skills to ensure you get the best possible price for your property."
        },
        {
            icon: "fa-file-contract",
            title: "Easy Process",
            description: "Experience a streamlined selling process with dedicated support and clear communication at every step."
        }
    ];

    const sellingGuides = [
        {
            id: 1,
            title: "Home Staging Guide",
            description: "Professional tips to make your home more attractive to potential buyers and increase its market value.",
            icon: "fa-paint-brush"
        },
        {
            id: 2,
            title: "Pricing Strategy",
            description: "Learn how to price your home competitively based on market trends and property features.",
            icon: "fa-chart-line"
        },
        {
            id: 3,
            title: "Marketing Tips",
            description: "Discover effective ways to market your property and reach the right audience.",
            icon: "fa-bullhorn"
        }
    ];

    const featuredListings = [
        {
            id: 1,
            title: "Spacious Family Home",
            price: 750000,
            location: "Suburban Area",
            image: IMAGES.FAMILY_HOME,
            features: ["4 Beds", "3 Baths", "3,200 sqft"]
        },
        {
            id: 2,
            title: "Cozy Downtown Condo",
            price: 450000,
            location: "City Center",
            image: IMAGES.CONDO,
            features: ["2 Beds", "2 Baths", "1,500 sqft"]
        }
    ];

    return (
        <div className="sell-page">
            {/* Hero Section */}
            <section className="sell-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>Sell Your Property</h1>
                    <p>List your property and reach thousands of potential buyers</p>
                </div>
            </section>

            {/* Main Content */}
            <div className="container">
                <div className="content-grid">
                    {/* Form Section */}
                    <div className="form-section">
                        <div className="listing-form">
                            <h2>Property Details</h2>
                            <form onSubmit={handleSubmit} className="form-grid">
                                {/* Sell/Rent Option */}
                                <div className="form-group">
                                    <label htmlFor="status">Listing Type</label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="for-sale">Sell</option>
                                        <option value="for-rent">Rent</option>
                                    </select>
                                </div>

                                {/* Basic Information */}
                                <div className="form-group">
                                    <label htmlFor="title">Property Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter property title"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="price">Price</label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter price"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="type">Property Type</label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        <option value="house">House</option>
                                        <option value="apartment">Apartment</option>
                                        <option value="villa">Villa</option>
                                        <option value="penthouse">Penthouse</option>
                                        <option value="land">Land</option>
                                        <option value="cabin">Cabin</option>
                                        <option value="commercial">Commercial</option>
                                    </select>
                                </div>

                                {/* Location */}
                                <div className="form-group">
                                    <label htmlFor="location">Location</label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter property location"
                                    />
                                </div>

                                {/* Property Details */}
                                <div className="form-group">
                                    <label htmlFor="bedrooms">Bedrooms</label>
                                    <input
                                        type="number"
                                        id="bedrooms"
                                        name="bedrooms"
                                        value={formData.bedrooms}
                                        onChange={handleChange}
                                        placeholder="Number of bedrooms"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="bathrooms">Bathrooms</label>
                                    <input
                                        type="number"
                                        id="bathrooms"
                                        name="bathrooms"
                                        value={formData.bathrooms}
                                        onChange={handleChange}
                                        placeholder="Number of bathrooms"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="area">Area (sq ft)</label>
                                    <input
                                        type="number"
                                        id="area"
                                        name="area"
                                        value={formData.area}
                                        onChange={handleChange}
                                        required
                                        placeholder="Property area"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="yearBuilt">Year Built</label>
                                    <input
                                        type="number"
                                        id="yearBuilt"
                                        name="yearBuilt"
                                        value={formData.yearBuilt}
                                        onChange={handleChange}
                                        placeholder="Year built"
                                    />
                                </div>

                                {/* Description */}
                                <div className="form-group full-width">
                                    <label htmlFor="description">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        placeholder="Describe your property..."
                                    ></textarea>
                                </div>

                                {/* Images Upload */}
                                <div className="form-group full-width">
                                    <label>Images</label>
                                    <div className="image-upload">
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleImageChange}
                                            id="image-upload"
                                            className="hidden"
                                        />
                                        <label htmlFor="image-upload" className="upload-label">
                                            Click to upload images
                                        </label>
                                        <p className="upload-hint">
                                            Upload up to 5 images (PNG, JPG up to 5MB)
                                        </p>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="form-group full-width">
                                    <h3>Contact Information</h3>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="contactName">Your Name</label>
                                    <input
                                        type="text"
                                        id="contactName"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="contactEmail">Email</label>
                                    <input
                                        type="email"
                                        id="contactEmail"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="contactPhone">Phone</label>
                                    <input
                                        type="tel"
                                        id="contactPhone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="submit-button"
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Submit Listing'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Benefits Section */}
                    <div className="benefits-section">
                        <h2>Why Sell With Us?</h2>
                        <div className="benefits-grid">
                            {sellerBenefits.map((benefit, index) => (
                                <div key={index} className="benefit-card">
                                    <i className={`fas ${benefit.icon}`}></i>
                                    <h3>{benefit.title}</h3>
                                    <p>{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sell; 