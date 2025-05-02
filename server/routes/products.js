const express = require("express")
const mongoose = require("mongoose")
const Product = require("../models/Product")
const Wishlist = require("../models/Wishlist")
const { authenticate } = require("../middleware/auth")

const router = express.Router()

// Update a product
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { name, price, imageUrl, description } = req.body

    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    // Check if user is the creator of the product
    if (product.addedBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to update this product" })
    }

    // Update fields
    if (name) product.name = name
    if (price !== undefined) product.price = price
    if (imageUrl !== undefined) product.imageUrl = imageUrl
    if (description !== undefined) product.description = description

    await product.save()

    // Populate user info
    const populatedProduct = await Product.findById(product._id)
      .populate("addedBy", "name email")
      .populate("reactions.user", "name email")
      .populate("comments.user", "name email")

    // Emit socket event to all members in the wishlist
    const io = req.app.get("io")
    if (io) {
      io.to(product.wishlistId.toString()).emit("product:updated", populatedProduct)
    }

    res.json(populatedProduct)
  } catch (error) {
    console.error("Update product error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete a product
router.delete("/:id", authenticate, async (req, res) => {
    try {
      const product = await Product.findById(req.params.id)
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" })
      }
  
      // Check if user is the creator of the product
      if (product.addedBy.toString() !== req.userId) {
        return res.status(403).json({ message: "Not authorized to delete this product" })
      }
  
      const wishlistId = product.wishlistId
  
      // Delete the product
      await Product.findByIdAndDelete(req.params.id)
  
      // Emit socket event to all members in the wishlist
      const io = req.app.get("io")
      if (io) {
        io.to(wishlistId.toString()).emit("product:deleted", req.params.id)
      }
  
      res.json({ message: "Product deleted successfully" })
    } catch (error) {
      console.error("Delete product error:", error)
      res.status(500).json({ message: "Server error" })
    }
  })
  
module.exports = router
