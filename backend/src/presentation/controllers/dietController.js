const { Op, Sequelize } = require("sequelize");
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

exports.getAllDiets = async (req, res) => {
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
          Sequelize.fn('LOWER', Sequelize.col('diet_plan')),
          'LIKE',
          `%${search}%`
        ),
        Sequelize.literal(`EXISTS (
          SELECT 1 FROM Users AS u
          WHERE u.id = Diet.user_id
          AND LOWER(CONCAT(u.first_name, ' ', u.last_name)) LIKE '%${search}%'
        )`)
      ];
    }

    const { count, rows } = await Diet.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, attributes: ['id', 'first_name', 'last_name'] },
        {
          model: AnalysisResult,
          attributes: ['id', 'analysis_type'],
          include: [
            {
              model: AppointmentRequest,
              attributes: ['id', 'scheduled_date', 'status']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    return res.json({
      diets: rows || [],
      page,
      totalPages: Math.ceil(count / limit),
      totalDiets: count,
    });
  } catch (err) {
    console.error("GET ALL DIETS ERROR:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getUserDiets = async (req, res) => {
  try {
    const { userId } = req.params;

    const diets = await Diet.findAll({
      where: { user_id: userId },
      include: [
        { model: AnalysisResult, attributes: ['id', 'analysis_type'] },
        { model: AppointmentRequest, attributes: ['id', 'scheduled_date', 'status'] }
      ],
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

    const diet = await Diet.findByPk(id, {
      include: [
        { model: User, attributes: ['id', 'first_name', 'last_name'] },
        { model: AnalysisResult, attributes: ['id', 'analysis_type'] },
        { model: AppointmentRequest, attributes: ['id', 'scheduled_date', 'status'] }
      ]
    });

    if (!diet) return res.status(404).json({ message: "Diet not found" });

    return res.json(diet);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateDiet = async (req, res) => {
  try {
    const { id } = req.params;
    const { diet_plan, analysis_id, request_id } = req.body;

    const diet = await Diet.findByPk(id);
    if (!diet) return res.status(404).json({ message: "Diet not found" });

    if (request_id && request_id !== diet.request_id) {
      const appointment = await AppointmentRequest.findByPk(request_id);
      if (!appointment) return res.status(404).json({ message: "Appointment not found" });
      diet.request_id = request_id;
    }

    if (diet_plan !== undefined) diet.diet_plan = diet_plan;
    if (analysis_id !== undefined) diet.analysis_id = analysis_id;

    await diet.save();

    if (req.user) {
      await createAuditLog({
        userId: req.user.id,
        username: req.user.username,
        role: req.user.role,
        action: "update",
        entity: "Diet",
        entityId: diet.id,
        description: `U përditësua dieta me ID=${diet.id}`
      });
    }

    return res.json(diet);
  } catch (err) {
    console.error("UPDATE DIET ERROR:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteDiet = async (req, res) => {
  try {
    const { id } = req.params;

    const diet = await Diet.findByPk(id);
    if (!diet) return res.status(404).json({ message: "Diet not found" });

    await diet.destroy();

    if (req.user) {
      await createAuditLog({
        userId: req.user.id,
        username: req.user.username,
        role: req.user.role,
        action: "delete",
        entity: "Diet",
        entityId: diet.id,
        description: `U fshi dieta me ID=${diet.id}`
      });
    }

    return res.json({ message: "Diet deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
