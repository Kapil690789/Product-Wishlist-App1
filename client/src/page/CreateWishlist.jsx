"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"
import "../styles/CreateWishlist.css"

const CreateWishlist = () => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Please enter a wishlist name")
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5001/api/wishlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          isPrivate,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Wishlist created successfully!")
        navigate(`/wishlists/${data._id}`)
      } else {
        toast.error(data.message || "Failed to create wishlist")
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="create-wishlist-container">
      <div className="create-wishlist-card">
        <h2>Create New Wishlist</h2>
        <p className="create-subtitle">Start a new collaborative shopping list</p>

        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-group">
            <label htmlFor="name">Wishlist Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Birthday Gifts, Holiday Shopping"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this wishlist for?"
              rows="3"
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
              <span>Make this wishlist private</span>
            </label>
            <p className="checkbox-help">Private wishlists are only visible to people you invite</p>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={() => navigate("/wishlists")}>
              Cancel
            </button>
            <button type="submit" className="create-button" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Wishlist"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateWishlist
