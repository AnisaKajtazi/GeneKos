const Diet = require('../../domain/models/Diet'); 
const AnalysisResult = require('../../domain/models/AnalysisResult');
const AppointmentRequest = require('../../domain/models/AppointmentRequest');
const User = require('../../domain/models/User');
const AuditLog = require('../../domain/models/AuditLog');

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

exports.createDiet = async (req, res) => {
  try {
    const { user_id, request_id, diet_plan, analysis_id } = req.body;

    if (!user_id || !request_id || !diet_plan) {
      return res.status(400).json({ message: "User ID, request ID and diet plan are required" });
    }

    const appointment = await AppointmentRequest.findByPk(request_id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const diet = await Diet.create({
      user_id,
      request_id,
      diet_plan,
      analysis_id: analysis_id || null
    });

    if (req.user) {
      await createAuditLog({
        userId: req.user.id,
        username: req.user.username,
        role: req.user.role,
        action: "create",
        entity: "Diet",
        entityId: diet.id,
        description: `U krijua dieta për user_id=${user_id}`
      });
    }

    return res.status(201).json(diet);
  } catch (err) {
    console.error("CREATE DIET ERROR:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getUserDiets = async (req, res) => {
  try {
    const { userId } = req.params;
    const diets = await Diet.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']]
    });
    return res.json({ diets });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getDietById = async (req, res) => {
  try {
    const { id } = req.params;
    const diet = await Diet.findByPk(id);
    if (!diet) return res.status(404).json({ message: "Diet not found" });
    return res.json(diet);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllDiets = async (req, res) => {
  try {
    const diets = await Diet.findAll({
      include: [
        { model: User, attributes: ['id', 'first_name', 'last_name'], required: false },
        {
          model: AnalysisResult,
          attributes: ['id', 'analysis_type'],
          required: false,
          include: [
            {
              model: AppointmentRequest,
              attributes: ['id', 'scheduled_date', 'status'],
              required: false
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });
    return res.json({ diets });
  } catch (err) {
    console.error("GET ALL DIETS ERROR:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};



exports.updateDiet = async (req, res) => {
  try {
    const { id } = req.params;
    const { diet_plan, analysis_id, request_id } = req.body;

    const diet = await Diet.findByPk(id);
    if (!diet) return res.status(404).json({ message: "Diet not found" });

    if (request_id) {
      const appointment = await AppointmentRequest.findByPk(request_id);
      if (!appointment) return res.status(404).json({ message: "Appointment not found" });
      diet.request_id = request_id;
    }

    diet.diet_plan = diet_plan ?? diet.diet_plan;
    diet.analysis_id = analysis_id ?? diet.analysis_id;

    await diet.save();
    return res.json(diet);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteDiet = async (req, res) => {
  try {
    const { id } = req.params;
    const diet = await Diet.findByPk(id);
    if (!diet) return res.status(404).json({ message: "Diet not found" });

    await diet.destroy();
    return res.json({ message: "Diet deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
