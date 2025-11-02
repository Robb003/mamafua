// routes/mamafuaRoute.js
const express = require("express");
const { getDashboardStats } = require("../controllers/mamafuaController");
const { protect, authorize } = require("../middleware/auth");
const router = express.Router();

router.get("/dashboard", protect, authorize(["mamafua"]), getDashboardStats);

module.exports = router;
