const express = require("express")
const router = express.Router()
const Property = require("../models/Property")
const auth = require("../middleware/auth")

// Get all properties with optional filtering
router.get("/", async (req, res) => {
  try {
    const {
      type,
      status,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      location,
      page = 1,
      limit = 10,
      sort = "-createdAt",
    } = req.query

    // Build filter object
    const filter = { active: true }

    if (type && type !== "all") {
      filter.type = type.toLowerCase()
    }

    if (status && status !== "all") {
      filter.status = status
    }

    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    if (bedrooms) {
      filter.bedrooms = { $gte: Number(bedrooms) }
    }

    if (bathrooms) {
      filter.bathrooms = { $gte: Number(bathrooms) }
    }

    if (location) {
      filter.$or = [
        { location: { $regex: location, $options: "i" } },
        { "address.city": { $regex: location, $options: "i" } },
        { "address.state": { $regex: location, $options: "i" } },
      ]
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Execute query
    const properties = await Property.find(filter)
      .populate("agent", "name email")
      .populate("owner", "name email")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))

    const total = await Property.countDocuments(filter)

    res.json({
      properties,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching properties:", error)
    res.status(500).json({ message: "Server error while fetching properties" })
  }
})

// Get single property by ID
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("agent", "name email phone")
      .populate("owner", "name email")

    if (!property) {
      return res.status(404).json({ message: "Property not found" })
    }

    // Increment view count
    property.views += 1
    await property.save()

    res.json(property)
  } catch (error) {
    console.error("Error fetching property:", error)
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid property ID" })
    }
    res.status(500).json({ message: "Server error while fetching property" })
  }
})

// Create new property (requires authentication)
router.post("/", auth, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      address,
      type,
      status,
      bedrooms,
      bathrooms,
      area,
      yearBuilt,
      features,
      amenities,
      images,
      contactInfo,
    } = req.body

    // Validate required fields
    if (!title || !description || !price || !location || !type || !area) {
      return res.status(400).json({
        message: "Missing required fields: title, description, price, location, type, area",
      })
    }

    // Create new property
    const property = new Property({
      title,
      description,
      price,
      location,
      address,
      type: type.toLowerCase(),
      status: status || "for-sale",
      bedrooms: bedrooms || 0,
      bathrooms: bathrooms || 0,
      area,
      yearBuilt,
      features: features || [],
      amenities: amenities || [],
      images: images || [],
      contactInfo,
      agent: req.user.id,
      owner: req.user.id,
      active: true,
    })

    await property.save()

    // Populate the response
    await property.populate("agent", "name email")
    await property.populate("owner", "name email")

    res.status(201).json({
      message: "Property created successfully",
      property,
    })
  } catch (error) {
    console.error("Error creating property:", error)
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: "Validation error", errors })
    }
    res.status(500).json({ message: "Server error while creating property" })
  }
})

// Update property (requires authentication and ownership)
router.put("/:id", auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({ message: "Property not found" })
    }

    // Check if user owns the property or is admin
    if (property.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this property" })
    }

    // Update property
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true },
    )
      .populate("agent", "name email")
      .populate("owner", "name email")

    res.json({
      message: "Property updated successfully",
      property: updatedProperty,
    })
  } catch (error) {
    console.error("Error updating property:", error)
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid property ID" })
    }
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: "Validation error", errors })
    }
    res.status(500).json({ message: "Server error while updating property" })
  }
})

// Delete property (requires authentication and ownership)
router.delete("/:id", auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({ message: "Property not found" })
    }

    // Check if user owns the property or is admin
    if (property.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this property" })
    }

    await Property.findByIdAndDelete(req.params.id)

    res.json({ message: "Property deleted successfully" })
  } catch (error) {
    console.error("Error deleting property:", error)
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid property ID" })
    }
    res.status(500).json({ message: "Server error while deleting property" })
  }
})

// Get properties by user (requires authentication)
router.get("/user/my-properties", auth, async (req, res) => {
  try {
    const properties = await Property.find({
      $or: [{ owner: req.user.id }, { agent: req.user.id }],
    }).sort("-createdAt")

    res.json({ properties })
  } catch (error) {
    console.error("Error fetching user properties:", error)
    res.status(500).json({ message: "Server error while fetching properties" })
  }
})

// Toggle property featured status (admin only)
router.patch("/:id/featured", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" })
    }

    const property = await Property.findById(req.params.id)
    if (!property) {
      return res.status(404).json({ message: "Property not found" })
    }

    property.featured = !property.featured
    await property.save()

    res.json({
      message: `Property ${property.featured ? "featured" : "unfeatured"} successfully`,
      property,
    })
  } catch (error) {
    console.error("Error updating featured status:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Increment inquiry count
router.post("/:id/inquire", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
    if (!property) {
      return res.status(404).json({ message: "Property not found" })
    }

    property.inquiries += 1
    await property.save()

    res.json({ message: "Inquiry recorded successfully" })
  } catch (error) {
    console.error("Error recording inquiry:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
