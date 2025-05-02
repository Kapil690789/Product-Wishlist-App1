"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useSocket } from "../context/SocketContext"
import ProductCard from "../components/ProductCard"
import AddProductModal from "../components/AddProductModel"
import InviteModal from "../components/InviteModal"
import toast from "react-hot-toast"
import "../styles/WishlistDetail.css"

const WishlistDetail = () => {
  const { id } = useParams()
  const [wishlist, setWishlist] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const { user } = useAuth()
  const { socket } = useSocket()
  const navigate = useNavigate()

  useEffect(() => {
    fetchWishlistDetails()

    // Socket event listeners for real-time updates
    if (socket) {
      socket.emit("join:wishlist", id)

      socket.on("product:added", (newProduct) => {
        if (newProduct.wishlistId === id) {
          setProducts((prev) => [newProduct, ...prev])
          toast.success("New product added to wishlist")
        }
      })

      socket.on("product:updated", (updatedProduct) => {
        if (updatedProduct.wishlistId === id) {
          setProducts((prev) => prev.map((product) => (product._id === updatedProduct._id ? updatedProduct : product)))
          toast.success("Product updated")
        }
      })

      socket.on("product:deleted", (productId) => {
        setProducts((prev) => prev.filter((product) => product._id !== productId))
        toast.success("Product removed from wishlist")
      })

      socket.on("wishlist:updated", (updatedWishlist) => {
        if (updatedWishlist._id === id) {
          setWishlist(updatedWishlist)
        }
      })

      socket.on("reaction:added", ({ productId, reaction, user }) => {
        setProducts((prev) =>
          prev.map((product) => {
            if (product._id === productId) {
              const updatedReactions = [...(product.reactions || []), { reaction, user }]
              return { ...product, reactions: updatedReactions }
            }
            return product
          }),
        )
      })

      socket.on("comment:added", ({ productId, comment }) => {
        setProducts((prev) =>
          prev.map((product) => {
            if (product._id === productId) {
              const updatedComments = [...(product.comments || []), comment]
              return { ...product, comments: updatedComments }
            }
            return product
          }),
        )
      })

      return () => {
        socket.emit("leave:wishlist", id)
        socket.off("product:added")
        socket.off("product:updated")
        socket.off("product:deleted")
        socket.off("wishlist:updated")
        socket.off("reaction:added")
        socket.off("comment:added")
      }
    }
  }, [id, socket])

  const fetchWishlistDetails = async () => {
    try {
      const token = localStorage.getItem("token")

      // Fetch wishlist details
      const wishlistResponse = await fetch(`http://localhost:5001/api/wishlists/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!wishlistResponse.ok) {
        if (wishlistResponse.status === 404) {
          toast.error("Wishlist not found")
          navigate("/wishlists")
          return
        }
        throw new Error("Failed to fetch wishlist")
      }

      const wishlistData = await wishlistResponse.json()
      setWishlist(wishlistData)

      // Fetch products in the wishlist
      const productsResponse = await fetch(`http://localhost:5001/api/wishlists/${id}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!productsResponse.ok) {
        throw new Error("Failed to fetch products")
      }

      const productsData = await productsResponse.json()
      setProducts(productsData)
    } catch (error) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setShowAddModal(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setShowAddModal(true)
  }

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to remove this product?")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5001/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        // The product will be removed from the UI via socket event
      } else {
        toast.error("Failed to delete product")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const handleInviteUsers = () => {
    setShowInviteModal(true)
  }

  if (loading) {
    return <div className="loading-container">Loading wishlist details...</div>
  }

  if (!wishlist) {
    return <div className="error-container">Wishlist not found</div>
  }

  return (
    <div className="wishlist-detail-container">
      <div className="wishlist-header">
        <div className="wishlist-info">
          <h1>{wishlist.name}</h1>
          <p className="wishlist-description">{wishlist.description}</p>
          <div className="wishlist-meta">
            <span>Created by {wishlist.createdBy.name}</span>
            <span>•</span>
            <span>
              {wishlist.members.length} member{wishlist.members.length !== 1 ? "s" : ""}
            </span>
            <span>•</span>
            <span>
              {products.length} item{products.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div className="wishlist-actions">
          <button className="invite-button" onClick={handleInviteUsers}>
            Invite Friends
          </button>
          <button className="add-product-button" onClick={handleAddProduct}>
            Add Product
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="empty-products">
          <div className="empty-icon">🛒</div>
          <h2>No products yet</h2>
          <p>Start adding products to your wishlist!</p>
          <button className="add-product-button" onClick={handleAddProduct}>
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              currentUser={user}
              onEdit={() => handleEditProduct(product)}
              onDelete={() => handleDeleteProduct(product._id)}
              wishlistId={id}
            />
          ))}
        </div>
      )}

      {showAddModal && (
        <AddProductModal
          wishlistId={id}
          product={editingProduct}
          onClose={() => {
            setShowAddModal(false)
            setEditingProduct(null)
          }}
        />
      )}

      {showInviteModal && <InviteModal wishlistId={id} onClose={() => setShowInviteModal(false)} />}
    </div>
  )
}

export default WishlistDetail
