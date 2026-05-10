const express = require("express");

const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  confirmUPIPayment,
  deleteOrder,
} = require("../../controllers/shop/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/confirm-payment", confirmUPIPayment);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);
router.delete("/delete/:id", deleteOrder);

module.exports = router;
