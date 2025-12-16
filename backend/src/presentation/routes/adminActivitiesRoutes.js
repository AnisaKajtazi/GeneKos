const express = require("express");
const router = express.Router();

const authMiddleware = require("../../infrastructure/middleware/authMiddleware");
const authorizeRole = require("../../infrastructure/middleware/authorizeRole");

const activityController = require("../controllers/activityController");

router.use(authMiddleware);
router.use(authorizeRole(["admin"]));


router.get("/", activityController.getAllActivities);
router.get("/:id", activityController.getActivityById);
router.post("/", activityController.createActivity);
router.put("/:id", activityController.updateActivity);
router.delete("/:id", activityController.deleteActivity);

module.exports = router;
