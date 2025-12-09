const express = require('express');
const router = express.Router();
const upload = require('../../infrastructure/middleware/upload');
const { uploadAnalysisPDF, getAnalysisResultsByUser } = require('../controllers/analysisResultController');

router.post('/upload', upload.single('pdf'), uploadAnalysisPDF);

router.get('/user/:userId', getAnalysisResultsByUser);

module.exports = router;
