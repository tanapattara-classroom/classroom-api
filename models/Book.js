const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    genre: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    year: {
      type: Number,
      min: 1000,
      max: new Date().getFullYear(),
    },
    price: {
      type: Number,
      min: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
bookSchema.index({ title: "text", author: "text", description: "text" });

module.exports = mongoose.model("Book", bookSchema);
