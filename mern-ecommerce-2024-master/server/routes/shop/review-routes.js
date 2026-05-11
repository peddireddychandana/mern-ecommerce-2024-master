const express = require("express");

const {
  addProductReview,
  getProductReviews,
} = require("../../controllers/shop/product-review-controller");

const { rateLimiter } = require("../../middleware/rateLimiter");

const router = express.Router();

router.post("/add", rateLimiter, addProductReview);
router.get("/:productId", getProductReviews);

module.exports = router;
