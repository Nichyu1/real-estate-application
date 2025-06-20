const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Property = require("../models/Property")
const User = require("../models/User")

dotenv.config()

const sampleProperties = [
  {
    title: "Luxury Villa with Ocean View",
    description:
      "Stunning 4-bedroom villa with panoramic ocean views, private pool, and modern amenities. Perfect for luxury living.",
    price: 2500000,
    location: "Malibu, CA",
    address: {
      street: "123 Ocean Drive",
      city: "Malibu",
      state: "CA",
      zipCode: "90265",
      country: "USA",
    },
    type: "villa",
    status: "for-sale",
    bedrooms: 4,
    bathrooms: 3,
    area: 3500,
    yearBuilt: 2020,
    features: ["Ocean View", "Private Pool", "Garage", "Garden", "Modern Kitchen"],
    amenities: ["Swimming Pool", "Gym", "Security System", "Smart Home"],
    contactInfo: {
      name: "John Smith",
      email: "john@realestate.com",
      phone: "+1-555-0123",
    },
  },
  {
    title: "Modern Downtown Apartment",
    description: "Sleek 2-bedroom apartment in the heart of downtown with city views and premium finishes.",
    price: 850000,
    location: "Downtown LA, CA",
    address: {
      street: "456 City Center Blvd",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90012",
      country: "USA",
    },
    type: "apartment",
    status: "for-sale",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    yearBuilt: 2019,
    features: ["City View", "Balcony", "Modern Kitchen", "Hardwood Floors"],
    amenities: ["Concierge", "Rooftop Deck", "Fitness Center", "Parking"],
    contactInfo: {
      name: "Sarah Johnson",
      email: "sarah@realestate.com",
      phone: "+1-555-0124",
    },
  },
  {
    title: "Cozy Family House",
    description: "Perfect family home with 3 bedrooms, large backyard, and quiet neighborhood location.",
    price: 650000,
    location: "Suburban Heights, CA",
    address: {
      street: "789 Maple Street",
      city: "Suburban Heights",
      state: "CA",
      zipCode: "90210",
      country: "USA",
    },
    type: "house",
    status: "for-sale",
    bedrooms: 3,
    bathrooms: 2,
    area: 2000,
    yearBuilt: 2015,
    features: ["Large Backyard", "Garage", "Fireplace", "Updated Kitchen"],
    amenities: ["Garden", "Patio", "Storage"],
    contactInfo: {
      name: "Mike Davis",
      email: "mike@realestate.com",
      phone: "+1-555-0125",
    },
  },
  {
    title: "Spacious Rental Apartment",
    description: "Beautiful 2-bedroom apartment available for rent in a prime location with all amenities.",
    price: 3500,
    location: "Beverly Hills, CA",
    address: {
      street: "321 Luxury Lane",
      city: "Beverly Hills",
      state: "CA",
      zipCode: "90210",
      country: "USA",
    },
    type: "apartment",
    status: "for-rent",
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    yearBuilt: 2018,
    features: ["Luxury Finishes", "Balcony", "Walk-in Closet", "Modern Appliances"],
    amenities: ["Pool", "Gym", "Concierge", "Valet Parking"],
    contactInfo: {
      name: "Lisa Wilson",
      email: "lisa@realestate.com",
      phone: "+1-555-0126",
    },
  },
  {
    title: "Prime Development Land",
    description: "Excellent opportunity for development. 2-acre plot in growing area with all utilities available.",
    price: 450000,
    location: "Riverside County, CA",
    address: {
      street: "Highway 74",
      city: "Riverside",
      state: "CA",
      zipCode: "92503",
      country: "USA",
    },
    type: "land",
    status: "for-sale",
    bedrooms: 0,
    bathrooms: 0,
    area: 87120, // 2 acres in sq ft
    yearBuilt: null,
    features: ["Utilities Available", "Highway Access", "Development Ready"],
    amenities: ["Water Access", "Electricity Available"],
    contactInfo: {
      name: "Robert Brown",
      email: "robert@realestate.com",
      phone: "+1-555-0127",
    },
  },
]

async function seedProperties() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log("Connected to MongoDB")

    // Clear existing properties
    await Property.deleteMany({})
    console.log("Cleared existing properties")

    // Find or create a default user for properties
    let defaultUser = await User.findOne({ email: "admin@example.com" })

    if (!defaultUser) {
      defaultUser = new User({
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123",
        userType: "seller",
        role: "admin",
      })
      await defaultUser.save()
      console.log("Created default admin user")
    }

    // Add default user as agent and owner for all properties
    const propertiesWithUser = sampleProperties.map((property) => ({
      ...property,
      agent: defaultUser._id,
      owner: defaultUser._id,
    }))

    // Insert sample properties
    const insertedProperties = await Property.insertMany(propertiesWithUser)
    console.log(`Inserted ${insertedProperties.length} properties`)

    console.log("Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

// Run the seed function
seedProperties()
