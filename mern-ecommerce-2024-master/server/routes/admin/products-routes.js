const express = require("express");

const {
  handleImageUpload,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
} = require("../../controllers/admin/products-controller");

const { upload } = require("../../helpers/cloudinary");
const { rateLimiter } = require("../../middleware/rateLimiter");

const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add", rateLimiter, addProduct);
router.put("/edit/:id", rateLimiter, editProduct);
router.delete("/delete/:id", rateLimiter, deleteProduct);
router.get("/get", fetchAllProducts);

module.exports = router;
