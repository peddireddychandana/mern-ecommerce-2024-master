const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    images: [String],
    title: String,
    description: String,
    category: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: Number,
    sizes: [String],
    colors: [{ name: String, value: String }],
    fabric: String,
    length: String,
    typeOfPiece: String,
    occasion: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
