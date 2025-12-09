const AnalysisResult = require('../../domain/models/AnalysisResult');
const AppointmentRequest = require('../../domain/models/AppointmentRequest');

const uploadAnalysisPDF = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { request_id, analysis_type } = req.body;
    if (!analysis_type) return res.status(400).json({ message: 'Analysis type is required' });

    const pdf_url = `/uploads/analyses/${req.file.filename}`;

    const result = await AnalysisResult.create({ request_id, pdf_url, analysis_type });

    res.status(201).json({ message: 'PDF uploaded successfully', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// NEW: Get all analysis results for a user
const getAnalysisResultsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all analysis results for this user's appointments
    const results = await AnalysisResult.findAll({
      include: [{
        model: AppointmentRequest,
        where: { user_id: userId },
        attributes: ['id', 'scheduled_date', 'status'] // optional, can include info about the appointment
      }],
      order: [['uploaded_at', 'DESC']]
    });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { uploadAnalysisPDF, getAnalysisResultsByUser };
