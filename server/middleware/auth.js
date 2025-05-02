const jwt = require("jsonwebtoken")

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "7d" },
  )
}

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
}

// Middleware to authenticate requests
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const decoded = verifyToken(token)
    req.userId = decoded.userId
    req.user = decoded.user

    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}

module.exports = {
  generateToken,
  verifyToken,
  authenticate,
}
