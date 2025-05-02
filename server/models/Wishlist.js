const mongoose = require("mongoose")

const wishlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Add creator to members array before saving
wishlistSchema.pre("save", function (next) {
  if (this.isNew) {
    // Make sure creator is in members array
    if (!this.members.includes(this.createdBy)) {
      this.members.push(this.createdBy)
    }
  }
  next()
})

const Wishlist = mongoose.model("Wishlist", wishlistSchema)

module.exports = Wishlist
