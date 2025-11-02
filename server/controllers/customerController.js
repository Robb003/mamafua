const Booking = require("../models/Booking");
const Review = require("../models/Review");
const Service = require("../models/Service");

// Get all bookings for the logged-in customer
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user.id })
      .populate("service", "name price")
      .populate("mamafua", "name email");
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a booking
exports.createBooking = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const service = await Service.findById(serviceId);

    if (!service) return res.status(404).json({ message: "Service not found" });

    const booking = await Booking.create({
      service: serviceId,
      mamafua: service.mamafua,
      customer: req.user.id,
      location: req.body.location,
      price: service.price,
      status: "pending",
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

// Get all reviews for the logged-in customer
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ customer: req.user.id })
      .populate("mamafua", "name email")
      .populate("service", "name");
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

// Create a review
exports.createReview = async (req, res) => {
  try {
    const { mamafuaId, rating, comment } = req.body;

    const review = await Review.create({
      customer: req.user.id,
      mamafua: mamafuaId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create review" });
  }
};
