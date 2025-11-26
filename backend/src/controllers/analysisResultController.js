const { createAnalysisResult } = require('../services/analysisResultService');

const uploadAnalysisPDF = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const request_id = req.body.request_id;
    const pdf_url = `/uploads/analyses/${req.file.filename}`;

    const result = await createAnalysisResult({ request_id, pdf_url });

    res.status(201).json({ message: 'PDF uploaded successfully', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { uploadAnalysisPDF };
