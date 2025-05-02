"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import "../styles/Modal.css"

const AddProductModal = ({ wishlistId, product, onClose }) => {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!product

  useEffect(() => {
    if (product) {
      setName(product.name)
      setPrice(product.price.toString())
      setImageUrl(product.imageUrl || "")
      setDescription(product.description || "")
    }
  }, [product])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Please enter a product name")
      return
    }

    if (!price || isNaN(Number.parseFloat(price)) || Number.parseFloat(price) <= 0) {
      toast.error("Please enter a valid price")
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")
      const url = isEditing
        ? `http://localhost:5001/api/products/${product._id}`
        : `http://localhost:5001/api/wishlists/${wishlistId}/products`

      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          price: Number.parseFloat(price),
          imageUrl: imageUrl || undefined,
          description: description || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(isEditing ? "Product updated successfully!" : "Product added successfully!")
        onClose()
      } else {
        toast.error(data.message || "Failed to save product")
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{isEditing ? "Edit Product" : "Add New Product"}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Wireless Headphones"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="29.99"
              min="0.01"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Image URL (Optional)</label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about the product"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? (isEditing ? "Updating..." : "Adding...") : isEditing ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProductModal
