const express = require("express");
const {getAllServices, createService, deleteService} = require("../controllers/serviceController");
const {protect, authorize} = require("../middleware/auth");
const router = express.Router();

router.get("/mamafua", protect, authorize(["mamafua"]), getAllServices);
router.get("/", protect, authorize(["customer", "mamafua"]), getAllServices); 
router.get ("/all", protect, authorize(["customer", "mamafua"]), getAllServices);
router.post("/", protect, authorize(["mamafua"]), createService);
router.delete("/:id", protect, authorize(["mamafua"]), deleteService);

module.exports = router