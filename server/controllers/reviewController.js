const Review = require("../models/Review");

exports.getAllReviews = async(req, res) => {
    try {
        let query = {};
        if(req.user.role === "customer"){
            query = {customer: req.user.id};
        } else if(req.user.role === "mamafua"){
            query = {mamafua: req.user.id};
        }
    const review = await Review.find(query)
    .populate("customer", "name email")
    .populate("mamafua", "name email");
    res.json(review);
    } catch (error) {
        res.status(500).send(error)
    }
};

exports.createReview = async(req, res) =>{
    try {
        if(req.user.role !== "customer"){
            return res.status(403).json({message: "Only customer can create a review"})
        }
    const review = await Review.create({...req.body, customer: req.user.id});
    res.json(review);
    } catch (error) {
        res.status(500).send(error)
    }
};

exports.deleteReview = async(req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if(!review) {
            return res.status(404).json({message: "review  not found"})
        }
        if(req.user.role !== "customer" || review.customer.toString() !== req.user.id){
            return res.status(403).json({message: "Only customers can delete a review"})
        }
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted"});
    } catch (error) {
        res.status(500).send(error)
    }
};