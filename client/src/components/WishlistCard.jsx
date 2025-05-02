import { Link } from "react-router-dom"
import "../styles/WishlistCard.css"

const WishlistCard = ({ wishlist, currentUser }) => {
  const { _id, name, description, createdBy, members, productCount } = wishlist

  // Check if current user is the creator
  const isCreator = createdBy._id === currentUser._id

  // Format the date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <Link to={`/wishlists/${_id}`} className="wishlist-card">
      <div className="wishlist-card-content">
        <h3 className="wishlist-name">{name}</h3>

        {description && <p className="wishlist-description">{description}</p>}

        <div className="wishlist-meta">
          <div className="wishlist-creator">{isCreator ? "Created by you" : `Created by ${createdBy.name}`}</div>

          <div className="wishlist-stats">
            <span className="wishlist-members">
              {members.length} member{members.length !== 1 ? "s" : ""}
            </span>
            <span className="wishlist-divider">•</span>
            <span className="wishlist-products">
              {productCount || 0} item{productCount !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="wishlist-date">Created {formatDate(wishlist.createdAt)}</div>
        </div>
      </div>

      <div className="wishlist-card-arrow">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </Link>
  )
}

export default WishlistCard
