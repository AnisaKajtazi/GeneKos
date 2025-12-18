const express = require("express");
const router = express.Router();
const userHealthProfileController = require("../controllers/userHealthProfileController");

router.post("/", userHealthProfileController.createProfile);
router.get("/user/:userId", userHealthProfileController.getProfileByUserId);
router.put("/:id", userHealthProfileController.updateProfile);
router.delete("/:id", userHealthProfileController.deleteProfile);

module.exports = router;
