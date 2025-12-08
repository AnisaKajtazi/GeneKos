const express = require("express");
const router = express.Router();
const dietController = require("../controllers/dietController");

router.post("/", dietController.createDiet);
router.get("/user/:userId", dietController.getUserDiets);
router.get("/:id", dietController.getDietById);
router.put("/:id", dietController.updateDiet);
router.delete("/:id", dietController.deleteDiet);

module.exports = router;
