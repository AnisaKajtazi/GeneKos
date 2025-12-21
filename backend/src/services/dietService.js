const dietRepository = require("../domain/repositories/dietRepository");
const AppointmentRequest = require("../domain/models/AppointmentRequest");
const { logAudit } = require("./auditLogService");

class DietService {
  async createDiet(data, user) {
    const { user_id, request_id, diet_plan, analysis_id } = data;
    if (!user_id || !request_id || !diet_plan) 
      throw { status: 400, message: "User ID, request ID and diet plan are required" };

    const appointment = await AppointmentRequest.findByPk(request_id);
    if (!appointment) throw { status: 404, message: "Appointment not found" };

    const diet = await dietRepository.create({ user_id, request_id, diet_plan, analysis_id: analysis_id || null });

    await logAudit({
      user,
      action: "create",
      entity: "Diet",
      entityId: diet.id,
      description: `U krijua dieta për user_id=${user_id}`,
    });

    return diet;
  }

  async getUserDiets(userId) {
    if (!userId) throw { status: 400, message: "User ID is required" };
    return dietRepository.findByUser(userId);
  }

  async getDietById(id) {
    const diet = await dietRepository.findById(id);
    if (!diet) throw { status: 404, message: "Diet not found" };
    return diet;
  }

  async getAllDiets() {
    return dietRepository.findAll();
  }

  async updateDiet(id, data) {
    const { diet_plan, analysis_id, request_id } = data;

    const diet = await dietRepository.findById(id);
    if (!diet) throw { status: 404, message: "Diet not found" };

    if (request_id) {
      const appointment = await AppointmentRequest.findByPk(request_id);
      if (!appointment) throw { status: 404, message: "Appointment not found" };
      diet.request_id = request_id;
    }

    diet.diet_plan = diet_plan ?? diet.diet_plan;
    diet.analysis_id = analysis_id ?? diet.analysis_id;

    return dietRepository.update(diet, diet);
  }

  async deleteDiet(id) {
    const diet = await dietRepository.findById(id);
    if (!diet) throw { status: 404, message: "Diet not found" };
    return dietRepository.delete(diet);
  }
}

module.exports = new DietService();
