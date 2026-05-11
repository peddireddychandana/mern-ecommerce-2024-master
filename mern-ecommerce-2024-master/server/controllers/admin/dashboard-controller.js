const Order = require("../../models/Order");
const Product = require("../../models/Product");
const User = require("../../models/User");

const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: "user" });

    const orders = await Order.find({});
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const pendingOrders = orders.filter((o) => o.orderStatus === "pending").length;
    const confirmedOrders = orders.filter((o) => o.orderStatus === "confirmed").length;
    const deliveredOrders = orders.filter((o) => o.orderStatus === "delivered").length;
    const cancelledOrders = orders.filter((o) => o.orderStatus === "rejected").length;
    const awaitingVerification = orders.filter((o) => o.orderStatus === "awaiting_verification").length;

    const lowStockProducts = await Product.find({ totalStock: { $lte: 10, $gt: 0 } }).countDocuments();
    const outOfStockProducts = await Product.find({ totalStock: { $lte: 0 } }).countDocuments();

    const monthlySales = Array.from({ length: 12 }, (_, i) => {
      const monthOrders = orders.filter((o) => {
        const d = new Date(o.orderDate);
        return d.getMonth() === i && o.paymentStatus === "paid";
      });
      return {
        month: new Date(2024, i).toLocaleString("en-US", { month: "short" }),
        revenue: monthOrders.reduce((s, o) => s + (o.totalAmount || 0), 0),
        orders: monthOrders.length,
      };
    });

    const topProductsMap = {};
    orders.forEach((o) => {
      (o.cartItems || []).forEach((item) => {
        const key = item.title || item.productId;
        topProductsMap[key] = topProductsMap[key] || { title: item.title || item.productId, quantity: 0, revenue: 0 };
        topProductsMap[key].quantity += item.quantity || 0;
        topProductsMap[key].revenue += (item.quantity || 0) * (parseFloat(item.price) || 0);
      });
    });
    const topProducts = Object.values(topProductsMap).sort((a, b) => b.quantity - a.quantity).slice(0, 5);

    const topCategoryMap = {};
    const allProducts = await Product.find({});
    const productMap = {};
    allProducts.forEach((p) => { productMap[p._id.toString()] = p.category; });

    orders.forEach((o) => {
      (o.cartItems || []).forEach((item) => {
        const cat = productMap[item.productId] || "Unknown";
        topCategoryMap[cat] = (topCategoryMap[cat] || 0) + (item.quantity || 0);
      });
    });
    const topCategories = Object.entries(topCategoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));

    const recentOrders = await Order.find().sort({ orderDate: -1 }).limit(5).populate("userId", "userName email");

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        cancelledOrders,
        awaitingVerification,
        lowStockProducts,
        outOfStockProducts,
        monthlySales,
        topProducts,
        topCategories,
        recentOrders,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getDashboardStats };
