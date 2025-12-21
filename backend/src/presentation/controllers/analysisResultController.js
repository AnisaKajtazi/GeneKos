const analysisResultService = require("../../services/analysisResultService");

exports.uploadAnalysisPDF = async (req, res) => {
  try {
    const result = await analysisResultService.uploadAnalysisPDF(req.file, req.body, req.user);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

exports.getAllAnalysisResults = async (req, res) => {
  try {
    const result = await analysisResultService.getAllAnalysisResults(req.query);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

exports.getAnalysisResultsByUser = async (req, res) => {
  try {
    const results = await analysisResultService.getAnalysisResultsByUser(req.params.userId);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

exports.updateAnalysisPDF = async (req, res) => {
  try {
    const updated = await analysisResultService.updateAnalysisPDF(req.params.id, req.body, req.file, req.user);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

exports.deleteAnalysisResult = async (req, res) => {
  try {
    await analysisResultService.deleteAnalysisResult(req.params.id, req.user);
    res.json({ message: "Analysis deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};
