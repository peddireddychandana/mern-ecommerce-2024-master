const express = require("express");

const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  uploadPaymentScreenshot,
  confirmUPIPayment,
  deleteOrder,
} = require("../../controllers/shop/order-controller");

const { upload } = require("../../helpers/cloudinary");
const { rateLimiter } = require("../../middleware/rateLimiter");

const router = express.Router();

router.post("/create", rateLimiter, createOrder);
router.post("/upload-screenshot", upload.single("payment_screenshot"), uploadPaymentScreenshot);
router.post("/confirm-payment", rateLimiter, confirmUPIPayment);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);
router.delete("/delete/:id", deleteOrder);

module.exports = router;
