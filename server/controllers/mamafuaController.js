// controllers/mamafuaController.js
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const Review = require("../models/Review");

exports.getDashboardStats = async (req, res) => {
  try {
    const mamafuaId = req.user.id;

    const totalBookings = await Booking.countDocuments({ mamafua: mamafuaId });
    const completedBookings = await Booking.countDocuments({ mamafua: mamafuaId, status: "completed" });
    const totalServices = await Service.countDocuments({ mamafua: mamafuaId });
    const reviews = await Review.find({ mamafua: mamafuaId });
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;

    res.json({
      totalBookings,
      completedBookings,
      totalServices,
      totalReviews,
      averageRating,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
