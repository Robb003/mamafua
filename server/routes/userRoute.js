const express  = require("express");
const {getAllMamafua, getMyProfile, updateMyProfile} = require("../controllers/userController");
const {protect, authorize} = require("../middleware/auth");
const router = express.Router();

router.get ("/all", protect, authorize(["customer"]), getAllMamafua);
router.get("/", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);

module.exports = router