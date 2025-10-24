const { default: mongoose } = require("mongoose");

const reviewSchema = new mongoose.Schema({
    customer: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    mamafua: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    booking: {type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true},
    rating: {type: Number, required: true, min: 1, max: 5},
    comment: {type: String, required: true}
});

module.exports = mongoose.model("Review", reviewSchema)