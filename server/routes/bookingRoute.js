const express = require("express");
const {
  getAllBookings,
  createBooking,
  deleteBooking,
  acceptBooking,
  rejectBooking,
} = require("../controllers/bookingController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, authorize(["customer", "mamafua"]), getAllBookings);
router.post("/", protect, authorize(["customer"]), createBooking);
router.delete("/:id", protect, authorize(["customer"]), deleteBooking);
router.put("/:id/accept", protect, authorize(["mamafua"]), acceptBooking);
router.put("/:id/reject", protect, authorize(["mamafua"]), rejectBooking);

module.exports = router;
