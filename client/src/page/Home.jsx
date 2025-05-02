"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useSocket } from "../context/SocketContext"
import WishlistCard from "../components/WishlistCard"
import "../styles/Home.css"
import toast from "react-hot-toast"

const Home = () => {
  const [wishlists, setWishlists] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { socket } = useSocket()
  const navigate = useNavigate()

  useEffect(() => {
    fetchWishlists()

    // Socket event listeners for real-time updates
    if (socket) {
      socket.on("wishlist:created", (newWishlist) => {
        setWishlists((prev) => [newWishlist, ...prev])
        toast.success(`New wishlist "${newWishlist.name}" was created`)
      })

      socket.on("wishlist:updated", (updatedWishlist) => {
        setWishlists((prev) =>
          prev.map((wishlist) => (wishlist._id === updatedWishlist._id ? updatedWishlist : wishlist)),
        )
      })

      socket.on("wishlist:deleted", (wishlistId) => {
        setWishlists((prev) => prev.filter((wishlist) => wishlist._id !== wishlistId))
        toast.success("Wishlist was deleted")
      })

      socket.on("wishlist:invited", (wishlistId) => {
        fetchWishlists()
        toast.success("You were invited to a new wishlist!")
      })

      return () => {
        socket.off("wishlist:created")
        socket.off("wishlist:updated")
        socket.off("wishlist:deleted")
        socket.off("wishlist:invited")
      }
    }
  }, [socket])

  const fetchWishlists = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5001/api/wishlists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setWishlists(data)
      } else {
        toast.error("Failed to fetch wishlists")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWishlist = () => {
    navigate("/wishlists/create")
  }

  if (loading) {
    return <div className="loading-container">Loading your wishlists...</div>
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Your Wishlists</h1>
        <button className="create-button" onClick={handleCreateWishlist}>
          Create New Wishlist
        </button>
      </div>

      {wishlists.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛍️</div>
          <h2>No wishlists yet</h2>
          <p>Create your first wishlist to start collaborating with friends!</p>
          <button className="create-button" onClick={handleCreateWishlist}>
            Create Your First Wishlist
          </button>
        </div>
      ) : (
        <div className="wishlists-grid">
          {wishlists.map((wishlist) => (
            <WishlistCard key={wishlist._id} wishlist={wishlist} currentUser={user} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
