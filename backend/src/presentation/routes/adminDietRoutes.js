const express = require("express");
const router = express.Router();

const authMiddleware = require("../../infrastructure/middleware/authMiddleware");
const authorizeRole = require("../../infrastructure/middleware/authorizeRole");
const dietController = require("../controllers/dietController");

router.use(authMiddleware);
router.use(authorizeRole(["admin"]));

router.get("/", dietController.getAllDiets);
router.get("/:id", dietController.getDietById);
router.post("/", dietController.createDiet);
router.put("/:id", dietController.updateDiet);
router.delete("/:id", dietController.deleteDiet);

module.exports = router;
