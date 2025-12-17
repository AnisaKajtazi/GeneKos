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

const getAnalysisResultsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const results = await AnalysisResult.findAll({
      include: [{
        model: AppointmentRequest,
        where: { user_id: userId },
        attributes: ['id', 'scheduled_date', 'status'] 
      }],
      order: [['uploaded_at', 'DESC']]
    });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAnalysisPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const { analysis_type } = req.body;

    const analysis = await AnalysisResult.findByPk(id);
    if (!analysis) return res.status(404).json({ message: 'Analysis not found' });

    analysis.analysis_type = analysis_type || analysis.analysis_type;
    if (req.file) {
      analysis.pdf_url = `/uploads/analyses/${req.file.filename}`;
    }

    await analysis.save();
    res.json({ message: 'Analysis updated successfully', analysis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteAnalysisResult = async (req, res) => {
  try {
    const { id } = req.params;

    const analysis = await AnalysisResult.findByPk(id);
    if (!analysis) return res.status(404).json({ message: 'Analysis not found' });

    await analysis.destroy();
    res.json({ message: 'Analysis deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  uploadAnalysisPDF,
  getAnalysisResultsByUser,
  updateAnalysisPDF,
  deleteAnalysisResult
};
