const { default: mongoose } = require("mongoose");

const bookingSchema = new mongoose.Schema({
    customer:{type: mongoose.Schema.Types.ObjectId, ref: "User"},
    service: {type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true},
    mamafua: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    location: {type: String, required: true},
    price: {type: Number},
    status: {type: String, enum: [ "pending", "accepted", "rejected"], default: "pending"}
});

module.exports = mongoose.model("Booking", bookingSchema)