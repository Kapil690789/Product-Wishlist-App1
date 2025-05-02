const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const http = require("http")
const socketIo = require("socket.io")
const dotenv = require("dotenv")
const authRoutes = require("./routes/auth")
const wishlistRoutes = require("./routes/wishlists")
const productRoutes = require("./routes/products")
const { verifyToken } = require("./middleware/auth")

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()
const server = http.createServer(app)

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/wishlists", wishlistRoutes)
app.use("/api/products", productRoutes)

// Socket.io setup
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

// Socket middleware to authenticate users
io.use((socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) {
    return next(new Error("Authentication error"))
  }

  try {
    const decoded = verifyToken(token)
    socket.userId = decoded.userId
    socket.user = decoded.user
    next()
  } catch (error) {
    next(new Error("Authentication error"))
  }
})

// Socket connection
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.userId}`)

  // Join a wishlist room
  socket.on("join:wishlist", (wishlistId) => {
    socket.join(wishlistId)
    console.log(`User ${socket.userId} joined wishlist: ${wishlistId}`)
  })

  // Leave a wishlist room
  socket.on("leave:wishlist", (wishlistId) => {
    socket.leave(wishlistId)
    console.log(`User ${socket.userId} left wishlist: ${wishlistId}`)
  })

  // Add reaction to a product
  socket.on("add:reaction", async ({ productId, wishlistId, reaction }) => {
    try {
      const Product = mongoose.model("Product")
      const product = await Product.findById(productId)

      if (!product) {
        return
      }

      // Check if user already reacted with this emoji
      const existingReaction = product.reactions.find(
        (r) => r.user.toString() === socket.userId && r.reaction === reaction,
      )

      if (existingReaction) {
        return
      }

      // Add reaction
      product.reactions.push({
        user: socket.userId,
        reaction,
      })

      await product.save()

      // Populate user info
      const populatedProduct = await Product.findById(productId).populate("reactions.user", "name email")

      const newReaction = populatedProduct.reactions.find(
        (r) => r.user._id.toString() === socket.userId && r.reaction === reaction,
      )

      // Emit to all users in the wishlist
      io.to(wishlistId).emit("reaction:added", {
        productId,
        reaction,
        user: newReaction.user,
      })
    } catch (error) {
      console.error("Error adding reaction:", error)
    }
  })

  // Add comment to a product
  socket.on("add:comment", async ({ productId, wishlistId, text }) => {
    try {
      const Product = mongoose.model("Product")
      const product = await Product.findById(productId)

      if (!product) {
        return
      }

      // Add comment
      product.comments.push({
        user: socket.userId,
        text,
      })

      await product.save()

      // Populate user info
      const populatedProduct = await Product.findById(productId).populate("comments.user", "name email")

      const newComment = populatedProduct.comments[populatedProduct.comments.length - 1]

      // Emit to all users in the wishlist
      io.to(wishlistId).emit("comment:added", {
        productId,
        comment: newComment,
      })
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  })

  // Disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.userId}`)
  })
})

// Start server
const PORT = process.env.PORT || 5001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
