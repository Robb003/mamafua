const Booking = require("../models/Booking");

exports.getAllBookings = async(req, res) => {
    try {
        let query = {};
        if(req.user.role === "customer"){
            query = {customer: req.user.id};
        } else if(req.user.role === "mamafua"){
            query = {mamafua: req.user.id};
        }
    const booking = await Booking.find(query)
    .populate("customer", "name email")
    .populate("mamafua", "name email")
    .populate("service", "name");
    res.json(booking);
    } catch (error) {
        res.status(500).send(error)
    }
};

exports.createBooking = async(req, res) =>{
    try {
        if(req.user.role !== "customer"){
            return res.status(403).json({message: "Only customer can create a booking"})
        }
    const booking = await Booking.create({...req.body, customer: req.user.id});
    res.json(booking);
    } catch (error) {
        res.status(500).send(error)
    }
};

exports.deleteBooking = async(req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if(!booking) {
            return res.status(404).json({message: "Booking not found"})
        }
        if(req.user.role !== "customer" || booking.customer.toString() !== req.user.id){
            return res.status(403).json({message: "Only customers can delete booking"})
        }
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted"});
    } catch (error) {
        res.status(500).send(error)
    }
};


exports.acceptBooking = async(req, res) => {
    try {
    const booking = await Booking.findById(req.params.id);
    if(!booking){
        return res.status(404).json({message: "booking not found"})
    }
    if(req.user.role !== "mamafua" || booking.mamafua.toString() !== req.user.id){
        return res.status(403).json({message: "only mamafua can accept booking"})
    }
    booking.status = "accepted";
    await booking.save();
    res.json({message: "booking accepted"});
    } catch (error) {
        res.status(500).send(error)
    }
};
exports.rejectBooking = async(req, res) => {
      try {
    const booking = await Booking.findById(req.params.id);
    if(!booking){
         return res.status(404).json({message: "booking not found"})
    }
    if(req.user.role !== "mamafua" || booking.mamafua.toString() !== req.user.id){
        return res.status(403).json({message: "only mamafua can reject the booking"})
    }
    booking.status = "rejected";
    await booking.save();
    res.json({message: "booking rejected"});
    } catch (error) {
        res.status(500).send(error)
    }
};