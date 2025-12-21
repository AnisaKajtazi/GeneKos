const fs = require("fs");
const path = require("path");
const { Op, Sequelize } = require("sequelize");
const analysisResultRepository = require("../domain/repositories/analysisResultRepository");
const AppointmentRequest = require("../domain/models/AppointmentRequest");
const auditLogService = require("./auditLogService");

class AnalysisResultService {
  async uploadAnalysisPDF(file, body, currentUser) {
    if (!file) throw { status: 400, message: "No file uploaded" };
    const { request_id, analysis_type } = body;
    if (!request_id) throw { status: 400, message: "Appointment must be selected" };
    if (!analysis_type) throw { status: 400, message: "Analysis type is required" };

    const appointment = await AppointmentRequest.findByPk(request_id);
    if (!appointment) throw { status: 404, message: "Selected appointment does not exist" };

    const pdf_url = `/uploads/analyses/${file.filename}`;
    const result = await analysisResultRepository.create({ request_id, analysis_type, pdf_url });

    if (currentUser) {
      await auditLogService.logAudit({
        userId: currentUser.id,
        username: currentUser.username,
        role: currentUser.role,
        action: "create",
        entity: "AnalysisResult",
        entityId: result.id,
        description: `U krijua analiza ${analysis_type} për request_id=${request_id}`,
      });
    }

    return result;
  }

  async getAllAnalysisResults({ page = 1, limit = 10, search = "" }) {
    const whereClause = {};

    if (search.trim()) {
      search = search.trim().toLowerCase();
      whereClause[Op.or] = [
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("analysis_type")), "LIKE", `%${search}%`),
        Sequelize.literal(`EXISTS (
          SELECT 1 FROM AppointmentRequests AS ar
          INNER JOIN Users AS u ON u.id = ar.user_id
          WHERE ar.id = AnalysisResult.request_id
          AND LOWER(CONCAT(u.first_name, ' ', u.last_name)) LIKE '%${search}%'
        )`),
      ];
    }

    const { rows, count } = await analysisResultRepository.findAll(whereClause, page, limit);
    return { analysisResults: rows, page, totalPages: Math.ceil(count / limit), totalResults: count };
  }

  async getAnalysisResultsByUser(userId) {
    return analysisResultRepository.findByUser(userId);
  }

  async updateAnalysisPDF(id, body, file, currentUser) {
    const analysis = await analysisResultRepository.findById(id);
    if (!analysis) throw { status: 404, message: "Analysis not found" };

    const { analysis_type, request_id, user_id } = body;

    if (request_id) {
      const appointment = await AppointmentRequest.findByPk(request_id);
      if (!appointment) throw { status: 404, message: "Selected appointment does not exist" };
      if (user_id && appointment.user_id.toString() !== user_id.toString())
        throw { status: 400, message: "Appointment does not belong to selected user" };
      analysis.request_id = request_id;
    }

    if (analysis_type) analysis.analysis_type = analysis_type;

    if (file) {
      const oldPath = path.join(process.cwd(), analysis.pdf_url.replace(/^\/+/, ""));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      analysis.pdf_url = `/uploads/analyses/${file.filename}`;
    }

    const updatedAnalysis = await analysisResultRepository.update(analysis, analysis);

    if (currentUser) {
      await auditLogService.logAudit({
        userId: currentUser.id,
        username: currentUser.username,
        role: currentUser.role,
        action: "update",
        entity: "AnalysisResult",
        entityId: updatedAnalysis.id,
        description: `U përditësua analiza ID=${updatedAnalysis.id}`,
      });
    }

    return analysisResultRepository.findById(id); 
  }

  async deleteAnalysisResult(id, currentUser) {
    const analysis = await analysisResultRepository.findById(id);
    if (!analysis) throw { status: 404, message: "Analysis not found" };

    await analysisResultRepository.delete(analysis);

    if (currentUser) {
      await auditLogService.logAudit({
        userId: currentUser.id,
        username: currentUser.username,
        role: currentUser.role,
        action: "delete",
        entity: "AnalysisResult",
        entityId: analysis.id,
        description: `U fshi analiza me ID=${analysis.id}`,
      });
    }
  }
}

module.exports = new AnalysisResultService();
