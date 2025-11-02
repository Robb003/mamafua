const express = require("express");
const {getAllReviews, createReview, deleteReview} = require("../controllers/reviewController");
const {protect, authorize} = require("../middleware/auth");
const router = express.Router();

router.get ("/all", protect, authorize(["customer", "mamafua"]), getAllReviews);
router.post("/", protect, authorize(["customer"]), createReview);
router.delete("/:id", protect, authorize(["customer"]), deleteReview);

module.exports = router