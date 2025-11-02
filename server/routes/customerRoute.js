const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getMyBookings,
  createBooking,
  getMyReviews,
  createReview,
} = require("../controllers/customerController");

// Customer routes
router.get("/bookings", protect, authorize(["customer"]), getMyBookings);
router.post("/bookings", protect, authorize(["customer"]), createBooking);

router.get("/reviews", protect, authorize(["customer"]), getMyReviews);
router.post("/reviews", protect, authorize(["customer"]), createReview);

module.exports = router;
