const express = require('express');
const router = express.Router();
const upload = require('../../infrastructure/middleware/upload');
const { uploadAnalysisPDF } = require('../controllers/analysisResultController');

router.post('/upload', upload.single('pdf'), uploadAnalysisPDF);

module.exports = router;
