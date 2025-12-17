const fs = require("fs");
const path = require("path");
const AnalysisResult = require("../../domain/models/AnalysisResult");
const AppointmentRequest = require("../../domain/models/AppointmentRequest");

const uploadAnalysisPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { request_id, analysis_type } = req.body;

    if (!request_id) {
      return res.status(400).json({ message: "Appointment must be selected" });
    }

    const appointment = await AppointmentRequest.findByPk(request_id);
    if (!appointment) {
      return res.status(404).json({ message: "Selected appointment does not exist" });
    }

    if (!analysis_type) {
      return res.status(400).json({ message: "Analysis type is required" });
    }

    const pdf_url = `/uploads/analyses/${req.file.filename}`;

    const result = await AnalysisResult.create({
      request_id,
      analysis_type,
      pdf_url,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAnalysisResultsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const results = await AnalysisResult.findAll({
      include: [
        {
          model: AppointmentRequest,
          where: { user_id: userId, status: "completed" }, 
          attributes: ["id", "scheduled_date", "status"],
        },
      ],
      order: [["uploaded_at", "DESC"]],
    });

    res.json(results);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateAnalysisPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const { analysis_type, request_id } = req.body; 

    const analysis = await AnalysisResult.findByPk(id);
    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    if (analysis_type) {
      analysis.analysis_type = analysis_type;
    }

    if (request_id) {
      analysis.request_id = request_id;
    }

    if (req.file) {
      const oldPath = path.join(__dirname, "../../../", analysis.pdf_url);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

      analysis.pdf_url = `/uploads/analyses/${req.file.filename}`;
    }

    await analysis.save();
    res.json(analysis);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const deleteAnalysisResult = async (req, res) => {
  try {
    const { id } = req.params;

    const analysis = await AnalysisResult.findByPk(id);
    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    const relativePath = analysis.pdf_url.replace(/^\/+/, "");
    const filePath = path.join(process.cwd(), relativePath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await analysis.destroy();
    res.json({ message: "Analysis deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  uploadAnalysisPDF,
  getAnalysisResultsByUser,
  updateAnalysisPDF,
  deleteAnalysisResult,
};
