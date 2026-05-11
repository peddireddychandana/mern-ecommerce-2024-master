const express = require("express");

const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  deleteOrder,
} = require("../../controllers/admin/order-controller");

const { rateLimiter } = require("../../middleware/rateLimiter");

const router = express.Router();

router.get("/get", getAllOrdersOfAllUsers);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/update/:id", rateLimiter, updateOrderStatus);
router.delete("/delete/:id", rateLimiter, deleteOrder);

module.exports = router;
