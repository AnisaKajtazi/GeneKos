const express = require('express');
const router = express.Router();
const upload = require('../../infrastructure/middleware/upload');
const {
  uploadAnalysisPDF,
  getAnalysisResultsByUser,
  updateAnalysisPDF,
  deleteAnalysisResult
} = require('../controllers/analysisResultController');

router.post('/upload', upload.single('pdf'), uploadAnalysisPDF);
router.get('/user/:userId', getAnalysisResultsByUser);
router.put('/:id', upload.single('pdf'), updateAnalysisPDF);

router.delete('/:id', deleteAnalysisResult);

module.exports = router;
