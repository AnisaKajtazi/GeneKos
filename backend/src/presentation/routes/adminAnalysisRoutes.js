const express = require("express");
const router = express.Router();

const authMiddleware = require("../../infrastructure/middleware/authMiddleware");
const authorizeRole = require("../../infrastructure/middleware/authorizeRole");
const analysisController = require("../controllers/analysisResultController");


const upload = require("../../infrastructure/middleware/upload");

router.use(authMiddleware);
router.use(authorizeRole(["admin"]));

router.get("/", analysisController.getAllAnalysisResults);
router.get("/user/:userId", analysisController.getAnalysisResultsByUser); 
router.post("/", upload.single("pdf"), analysisController.uploadAnalysisPDF);
router.put("/:id", upload.single("pdf"), analysisController.updateAnalysisPDF);
router.delete("/:id", analysisController.deleteAnalysisResult);


module.exports = router;
