const fs = require("fs");
const path = require("path");
const { Op, Sequelize } = require("sequelize");
const AnalysisResult = require("../../domain/models/AnalysisResult");
const AppointmentRequest = require("../../domain/models/AppointmentRequest");
const User = require("../../domain/models/User");
const AuditLog = require("../../domain/models/AuditLog");

// ---------------- AUDIT LOG ----------------
const createAuditLog = async ({ userId, username, role, action, entity, entityId, description }) => {
  try {
    await AuditLog.create({
      user_id: userId,
      username,
      role,
      action,
      entity,
      entity_id: entityId,
      description,
    });
  } catch (err) {
    console.error("Audit log error:", err);
  }
};

// ---------------- UPLOAD ANALYSIS ----------------
const uploadAnalysisPDF = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { request_id, analysis_type } = req.body;
    if (!request_id) return res.status(400).json({ message: "Appointment must be selected" });
    if (!analysis_type) return res.status(400).json({ message: "Analysis type is required" });

    const appointment = await AppointmentRequest.findByPk(request_id);
    if (!appointment) return res.status(404).json({ message: "Selected appointment does not exist" });

    const pdf_url = `/uploads/analyses/${req.file.filename}`;
    const result = await AnalysisResult.create({ request_id, analysis_type, pdf_url });

    if (req.user) {
      await createAuditLog({
        userId: req.user.id,
        username: req.user.username,
        role: req.user.role,
        action: "create",
        entity: "AnalysisResult",
        entityId: result.id,
        description: `U krijua analiza ${analysis_type} për request_id=${request_id}`
      });
    }

    res.status(201).json(result);
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- GET ALL ANALYSIS RESULTS WITH PAGINATION & SEARCH ----------------
const getAllAnalysisResults = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = '' } = req.query;
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (search && search.trim() !== '') {
      search = search.trim().toLowerCase();
      whereClause[Op.or] = [
        Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('analysis_type')),
          'LIKE',
          `%${search}%`
        ),
        Sequelize.literal(`EXISTS (
          SELECT 1 FROM AppointmentRequests AS ar
          INNER JOIN Users AS u ON u.id = ar.user_id
          WHERE ar.id = AnalysisResult.request_id
          AND LOWER(CONCAT(u.first_name, ' ', u.last_name)) LIKE '%${search}%'
        )`)
      ];
    }

    const { count, rows } = await AnalysisResult.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: AppointmentRequest,
          attributes: ["id", "scheduled_date", "status", "user_id"],
          include: [
            { model: User, attributes: ["id", "first_name", "last_name"] }
          ]
        }
      ],
      order: [["uploaded_at", "DESC"]],
      limit,
      offset,
    });

    res.json({
      analysisResults: rows || [],
      page,
      totalPages: Math.ceil(count / limit),
      totalResults: count,
    });
  } catch (err) {
    console.error("FETCH ALL ANALYSIS ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------------- GET USER ANALYSIS RESULTS ----------------
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
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------------- UPDATE ANALYSIS ----------------
const updateAnalysisPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const { analysis_type, request_id, user_id } = req.body;

    const analysis = await AnalysisResult.findByPk(id, {
      include: [
        { model: AppointmentRequest, include: [{ model: User, attributes: ["id", "first_name", "last_name"] }] }
      ]
    });

    if (!analysis) return res.status(404).json({ message: "Analysis not found" });

    if (request_id) {
      const appointment = await AppointmentRequest.findByPk(request_id);
      if (!appointment) return res.status(404).json({ message: "Selected appointment does not exist" });
      if (user_id && appointment.user_id.toString() !== user_id.toString()) {
        return res.status(400).json({ message: "Appointment does not belong to selected user" });
      }
      analysis.request_id = request_id;
    }

    if (analysis_type) analysis.analysis_type = analysis_type;

    if (req.file) {
      const oldPath = path.join(__dirname, "../../../", analysis.pdf_url);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      analysis.pdf_url = `/uploads/analyses/${req.file.filename}`;
    }

    await analysis.save();

    if (req.user) {
      await createAuditLog({
        userId: req.user.id,
        username: req.user.username,
        role: req.user.role,
        action: "update",
        entity: "AnalysisResult",
        entityId: analysis.id,
        description: `U përditësua analiza ID=${analysis.id}`
      });
    }

    const updatedAnalysis = await AnalysisResult.findByPk(id, {
      include: [
        {
          model: AppointmentRequest,
          attributes: ["id", "scheduled_date", "status", "user_id"],
          include: [{ model: User, attributes: ["id", "first_name", "last_name"] }]
        }
      ]
    });

    res.json(updatedAnalysis);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------------- DELETE ANALYSIS ----------------
const deleteAnalysisResult = async (req, res) => {
  try {
    const { id } = req.params;

    const analysis = await AnalysisResult.findByPk(id);
    if (!analysis) return res.status(404).json({ message: "Analysis not found" });

    const relativePath = analysis.pdf_url.replace(/^\/+/, "");
    const filePath = path.join(process.cwd(), relativePath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await analysis.destroy();

    if (req.user) {
      await createAuditLog({
        userId: req.user.id,
        username: req.user.username,
        role: req.user.role,
        action: "delete",
        entity: "AnalysisResult",
        entityId: analysis.id,
        description: `U fshi analiza me ID=${analysis.id}`
      });
    }

    res.json({ message: "Analysis deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  uploadAnalysisPDF,
  getAllAnalysisResults,
  getAnalysisResultsByUser,
  updateAnalysisPDF,
  deleteAnalysisResult,
};
