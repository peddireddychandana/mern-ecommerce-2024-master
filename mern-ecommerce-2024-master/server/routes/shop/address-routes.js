const express = require("express");

const {
  addAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress,
} = require("../../controllers/shop/address-controller");

const { rateLimiter } = require("../../middleware/rateLimiter");

const router = express.Router();

router.post("/add", rateLimiter, addAddress);
router.get("/get/:userId", fetchAllAddress);
router.delete("/delete/:userId/:addressId", deleteAddress);
router.put("/update/:userId/:addressId", rateLimiter, editAddress);

module.exports = router;
