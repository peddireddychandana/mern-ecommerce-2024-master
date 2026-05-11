const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const adminDashboardRouter = require("./routes/admin/dashboard-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const app = express();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const allowedOrigins = [
  "http://localhost:5173",
  "https://ecommerce-frontend-n724.onrender.com",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.options("*", cors());

app.use(cookieParser());
app.use(express.json());

const mount = (path, router) => {
  app.use(`/api${path}`, router);
  app.use(path, router);
};

mount("/auth", authRouter);
mount("/admin/products", adminProductsRouter);
mount("/admin/orders", adminOrderRouter);
mount("/admin/dashboard", adminDashboardRouter);
mount("/shop/products", shopProductsRouter);
mount("/shop/cart", shopCartRouter);
mount("/shop/address", shopAddressRouter);
mount("/shop/order", shopOrderRouter);
mount("/shop/search", shopSearchRouter);
mount("/shop/review", shopReviewRouter);

const clientBuildPath = path.join(__dirname, "..", "client", "dist");
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

module.exports = app;
