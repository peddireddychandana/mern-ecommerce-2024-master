const router = require("express").Router();
const { getDashboardStats } = require("../../controllers/admin/dashboard-controller");

router.get("/stats", getDashboardStats);

module.exports = router;
