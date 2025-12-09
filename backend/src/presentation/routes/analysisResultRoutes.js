const express = require('express');
const router = express.Router();
const upload = require('../../infrastructure/middleware/upload');
const { uploadAnalysisPDF, getAnalysisResultsByUser } = require('../controllers/analysisResultController');

// Upload PDF
router.post('/upload', upload.single('pdf'), uploadAnalysisPDF);

// Get all analysis results for a specific user
router.get('/user/:userId', getAnalysisResultsByUser);

module.exports = router;
