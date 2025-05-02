"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import Login from "./page/Login"
import Register from "./page/Register"
import Home from "./page/Home"
import WishlistDetail from "./page/WishlistDetail"
import CreateWishlist from "./page/CreateWishlist"
import { AuthProvider } from "./context/AuthContext"
import { SocketProvider } from "./context/SocketContext"
import { Toaster } from "react-hot-toast"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/wishlists"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wishlists/create"
                  element={
                    <ProtectedRoute>
                      <CreateWishlist />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wishlists/:id"
                  element={
                    <ProtectedRoute>
                      <WishlistDetail />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/wishlists" replace />} />
              </Routes>
            </main>
            <Toaster position="top-right" />
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  )
}

// Protected route component to handle authentication
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      // Verify token validity
      fetch("http://localhost:5001/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user)
          } else {
            localStorage.removeItem("token")
          }
          setLoading(false)
        })
        .catch(() => {
          localStorage.removeItem("token")
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  return { user, loading }
}

export default App
