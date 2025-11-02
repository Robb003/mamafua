const Booking = require("../models/Booking");
const Service = require("../models/Service");

// Get bookings (for customer or mamafua)
exports.getAllBookings = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "customer") {
      query = { customer: req.user.id };
    } else if (req.user.role === "mamafua") {
      query = { mamafua: req.user.id };
    }

    const bookings = await Booking.find(query)
      .populate("customer", "name email")
      .populate("mamafua", "name email")
      .populate("service", "name price");

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a booking (Customer only)
exports.createBooking = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Only customers can create a booking" });
    }

    const { service, mamafua, location } = req.body;
    if (!service || !mamafua || !location) {
      return res.status(400).json({ message: "Service, Mamafua, and location are required" });
    }

    const selectedService = await Service.findById(service);
    if (!selectedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    const booking = await Booking.create({
      service,
      mamafua,
      location,
      price: selectedService.price,
      customer: req.user.id,
      status: "pending",
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

// Delete a booking (Customer only)
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (req.user.role !== "customer" || booking.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this booking" });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mamafua accepts a booking
exports.acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (req.user.role !== "mamafua" || booking.mamafua.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to accept this booking" });
    }

    booking.status = "accepted";
    await booking.save();

    res.json({ message: "Booking accepted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mamafua rejects a booking
exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (req.user.role !== "mamafua" || booking.mamafua.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to reject this booking" });
    }

    booking.status = "rejected";
    await booking.save();

    res.json({ message: "Booking rejected successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
