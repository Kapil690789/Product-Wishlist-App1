"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../styles/Navbar.css"

const Navbar = () => {
  const { user, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🛍️</span>
          <span className="logo-text">FlockShop</span>
        </Link>

        {user ? (
          <div className="navbar-right">
            <div className="user-menu">
              <button className="user-button" onClick={toggleDropdown}>
                <span className="user-name">{user.name}</span>
                <span className="user-avatar">{user.name.charAt(0)}</span>
              </button>

              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to="/wishlists" className="dropdown-item">
                    My Wishlists
                  </Link>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="navbar-right">
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-button">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
