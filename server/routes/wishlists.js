const express = require("express")
const mongoose = require("mongoose")
const Wishlist = require("../models/Wishlist")
const Product = require("../models/Product")
const User = require("../models/User")
const { authenticate } = require("../middleware/auth")

const router = express.Router()

// Get all wishlists for the current user
router.get("/", authenticate, async (req, res) => {
  try {
    // Find all wishlists where the user is a member
    const wishlists = await Wishlist.find({ members: req.userId })
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 })

    // Get product count for each wishlist
    const wishlistsWithCount = await Promise.all(
      wishlists.map(async (wishlist) => {
        const productCount = await Product.countDocuments({ wishlistId: wishlist._id })
        return {
          ...wishlist.toObject(),
          productCount,
        }
      }),
    )

    res.json(wishlistsWithCount)
  } catch (error) {
    console.error("Get wishlists error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create a new wishlist
router.post("/", authenticate, async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body

    const wishlist = new Wishlist({
      name,
      description,
      createdBy: req.userId,
      members: [req.userId],
      isPrivate: isPrivate || false,
    })

    await wishlist.save()

    // Populate creator and members
    const populatedWishlist = await Wishlist.findById(wishlist._id)
      .populate("createdBy", "name email")
      .populate("members", "name email")

    // Emit socket event to all members
    const io = req.app.get("io")
    if (io) {
      io.emit("wishlist:created", populatedWishlist)
    }

    res.status(201).json(populatedWishlist)
  } catch (error) {
    console.error("Create wishlist error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get a specific wishlist
router.get("/:id", authenticate, async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email")

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" })
    }

    // Check if user is a member of the wishlist
    if (!wishlist.members.some((member) => member._id.toString() === req.userId)) {
      return res.status(403).json({ message: "Not authorized to view this wishlist" })
    }

    res.json(wishlist)
  } catch (error) {
    console.error("Get wishlist error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update a wishlist
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body

    const wishlist = await Wishlist.findById(req.params.id)

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" })
    }

    // Check if user is the creator of the wishlist
    if (wishlist.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to update this wishlist" })
    }

    // Update fields
    if (name) wishlist.name = name
    if (description !== undefined) wishlist.description = description
    if (isPrivate !== undefined) wishlist.isPrivate = isPrivate

    await wishlist.save()

    // Populate creator and members
    const populatedWishlist = await Wishlist.findById(wishlist._id)
      .populate("createdBy", "name email")
      .populate("members", "name email")

    // Emit socket event to all members
    const io = req.app.get("io")
    if (io) {
      io.to(req.params.id).emit("wishlist:updated", populatedWishlist)
    }

    res.json(populatedWishlist)
  } catch (error) {
    console.error("Update wishlist error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete a wishlist
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id)

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" })
    }

    // Check if user is the creator of the wishlist
    if (wishlist.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete this wishlist" })
    }

    // Delete all products in the wishlist
    await Product.deleteMany({ wishlistId: wishlist._id })

    // Delete the wishlist
    await wishlist.remove()

    // Emit socket event to all members
    const io = req.app.get("io")
    if (io) {
      io.to(req.params.id).emit("wishlist:deleted", req.params.id)
    }

    res.json({ message: "Wishlist deleted successfully" })
  } catch (error) {
    console.error("Delete wishlist error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all products in a wishlist
router.get("/:id/products", authenticate, async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id)

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" })
    }

    // Check if user is a member of the wishlist
    if (!wishlist.members.some((member) => member.toString() === req.userId)) {
      return res.status(403).json({ message: "Not authorized to view this wishlist" })
    }

    const products = await Product.find({ wishlistId: req.params.id })
      .populate("addedBy", "name email")
      .populate("reactions.user", "name email")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 })

    res.json(products)
  } catch (error) {
    console.error("Get products error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Add a product to a wishlist
router.post("/:id/products", authenticate, async (req, res) => {
  try {
    const { name, price, imageUrl, description } = req.body

    const wishlist = await Wishlist.findById(req.params.id)

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" })
    }

    // Check if user is a member of the wishlist
    if (!wishlist.members.some((member) => member.toString() === req.userId)) {
      return res.status(403).json({ message: "Not authorized to add products to this wishlist" })
    }

    const product = new Product({
      name,
      price,
      imageUrl,
      description,
      wishlistId: req.params.id,
      addedBy: req.userId,
    })

    await product.save()

    // Populate user info
    const populatedProduct = await Product.findById(product._id).populate("addedBy", "name email")

    // Emit socket event to all members in the wishlist
    const io = req.app.get("io")
    if (io) {
      io.to(req.params.id).emit("product:added", populatedProduct)
    }

    res.status(201).json(populatedProduct)
  } catch (error) {
    console.error("Add product error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Invite users to a wishlist
router.post("/:id/invite", authenticate, async (req, res) => {
  try {
    const { emails } = req.body

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ message: "Please provide at least one email to invite" })
    }

    const wishlist = await Wishlist.findById(req.params.id)

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" })
    }

    // Check if user is a member of the wishlist
    if (!wishlist.members.some((member) => member.toString() === req.userId)) {
      return res.status(403).json({ message: "Not authorized to invite users to this wishlist" })
    }

    // Find users by email
    const users = await User.find({ email: { $in: emails } })

    // Add users to members if they're not already members
    const newMembers = []

    for (const user of users) {
      if (!wishlist.members.includes(user._id)) {
        wishlist.members.push(user._id)
        newMembers.push(user)
      }
    }

    await wishlist.save()

    // In a real app, you would send emails to the invited users here

    // Emit socket event to new members
    const io = req.app.get("io")
    if (io) {
      for (const user of newMembers) {
        // Notify online users about the invitation
        io.emit("wishlist:invited", {
          wishlistId: wishlist._id,
          userId: user._id,
        })
      }
    }

    res.json({
      message: "Invitations sent successfully",
      invitedUsers: users.map((user) => ({ _id: user._id, email: user.email, name: user.name })),
    })
  } catch (error) {
    console.error("Invite users error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
