"use client"

import { createContext, useState, useContext, useEffect } from "react"
import toast from "react-hot-toast"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (token) {
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

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)
        setUser(data.user)
        toast.success("Logged in successfully!")
        return true
      } else {
        toast.error(data.message || "Login failed")
        return false
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
      return false
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)
        setUser(data.user)
        toast.success("Registered successfully!")
        return true
      } else {
        toast.error(data.message || "Registration failed")
        return false
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    toast.success("Logged out successfully!")
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
