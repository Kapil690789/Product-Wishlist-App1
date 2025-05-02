"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { io } from "socket.io-client"
import { useAuth } from "./AuthContext"

const SocketContext = createContext()

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      const newSocket = io("http://localhost:5001", {
        auth: {
          token: localStorage.getItem("token"),
        },
      })

      setSocket(newSocket)

      // Clean up on unmount
      return () => {
        newSocket.disconnect()
      }
    } else {
      if (socket) {
        socket.disconnect()
        setSocket(null)
      }
    }
  }, [user])

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
}
