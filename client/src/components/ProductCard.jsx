"use client"

import { useState } from "react"
import { useSocket } from "../context/SocketContext"
import toast from "react-hot-toast"
import "../styles/ProductCard.css"

const ProductCard = ({ product, currentUser, onEdit, onDelete, wishlistId }) => {
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState("")
  const { socket } = useSocket()

  const { _id, name, imageUrl, price, description, addedBy, reactions = [], comments = [] } = product

  // Check if current user is the creator
  const isCreator = addedBy._id === currentUser._id

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const handleReaction = (emoji) => {
    if (!socket) return

    // Check if user already reacted with this emoji
    const alreadyReacted = reactions.some((r) => r.user._id === currentUser._id && r.reaction === emoji)

    if (alreadyReacted) {
      toast("You already reacted with this emoji")
      return
    }

    socket.emit("add:reaction", {
      productId: _id,
      wishlistId,
      reaction: emoji,
    })
  }

  const handleAddComment = (e) => {
    e.preventDefault()

    if (!comment.trim()) return

    if (!socket) return

    socket.emit("add:comment", {
      productId: _id,
      wishlistId,
      text: comment,
    })

    setComment("")
  }

  // Group reactions by emoji
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.reaction]) {
      acc[reaction.reaction] = []
    }
    acc[reaction.reaction].push(reaction.user)
    return acc
  }, {})

  return (
    <div className="product-card">
      <div className="product-image-container">
        {imageUrl ? (
          <img src={imageUrl || "/placeholder.svg"} alt={name} className="product-image" />
        ) : (
          <div className="product-image-placeholder">
            <span>No Image</span>
          </div>
        )}
      </div>

      <div className="product-content">
        <h3 className="product-name">{name}</h3>

        <div className="product-price">{formatPrice(price)}</div>

        {description && <p className="product-description">{description}</p>}

        <div className="product-meta">
          <span className="product-added-by">Added by {isCreator ? "you" : addedBy.name}</span>
        </div>

        <div className="product-reactions">
          {Object.entries(groupedReactions).map(([emoji, users]) => (
            <div key={emoji} className="reaction-group" title={users.map((u) => u.name).join(", ")}>
              <span className="reaction-emoji">{emoji}</span>
              <span className="reaction-count">{users.length}</span>
            </div>
          ))}
        </div>

        <div className="product-actions">
          <div className="reaction-buttons">
            <button onClick={() => handleReaction("👍")} className="reaction-button">
              👍
            </button>
            <button onClick={() => handleReaction("❤️")} className="reaction-button">
              ❤️
            </button>
            <button onClick={() => handleReaction("🔥")} className="reaction-button">
              🔥
            </button>
            <button onClick={() => handleReaction("🛒")} className="reaction-button">
              🛒
            </button>
          </div>

          <div className="comment-button-container">
            <button className="comment-toggle-button" onClick={() => setShowComments(!showComments)}>
              {comments.length > 0 ? `${comments.length} comments` : "Add comment"}
            </button>
          </div>

          {isCreator && (
            <div className="creator-actions">
              <button onClick={onEdit} className="edit-button">
                Edit
              </button>
              <button onClick={onDelete} className="delete-button">
                Delete
              </button>
            </div>
          )}
        </div>

        {showComments && (
          <div className="comments-section">
            <div className="comments-list">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={index} className="comment-item">
                    <div className="comment-author">{comment.user.name}</div>
                    <div className="comment-text">{comment.text}</div>
                  </div>
                ))
              ) : (
                <div className="no-comments">No comments yet</div>
              )}
            </div>

            <form onSubmit={handleAddComment} className="comment-form">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="comment-input"
              />
              <button type="submit" className="comment-submit">
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCard
