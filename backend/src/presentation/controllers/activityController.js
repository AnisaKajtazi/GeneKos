const { Op, Sequelize } = require("sequelize");
const Activity = require('../../domain/models/Activity');
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

exports.createActivity = async (req, res) => {
  try {
    const { user_id, request_id, activity_plan, analysis_id } = req.body;

    if (!user_id || !request_id || !activity_plan) {
      return res.status(400).json({
        message: "User ID, appointment dhe activity plan janë të detyrueshme"
      });
    }

    const appointment = await AppointmentRequest.findOne({
      where: { id: request_id, user_id }
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Takimi i zgjedhur nuk ekziston për këtë pacient"
      });
    }

    const activity = await Activity.create({
      user_id,
      request_id,
      analysis_id: analysis_id || null,
      activity_plan
    });

    if (req.user) {
      await createAuditLog({
        userId: req.user.id,
        username: req.user.username,
        role: req.user.role,
        action: "create",
        entity: "Activity",
        entityId: activity.id,
        description: `U krijua aktivitet për request_id=${request_id}`
      });
    }

    res.status(201).json(activity);
  } catch (err) {
    console.error("CREATE ACTIVITY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllActivities = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = '' } = req.query;
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (search && search.trim() !== '') {
      search = search.trim().toLowerCase();

      // Filter kryesor
      whereClause[Op.or] = [
        Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('activity_plan')),
          'LIKE',
          `%${search}%`
        ),
        Sequelize.literal(`EXISTS (
          SELECT 1 FROM Users AS u
          WHERE u.id = Activity.user_id
          AND LOWER(CONCAT(u.first_name, ' ', u.last_name)) LIKE '%${search}%'
        )`)
      ];
    }

    const { count, rows } = await Activity.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['id', 'first_name', 'last_name']
        },
        {
          model: AppointmentRequest,
          attributes: ['id', 'scheduled_date', 'status']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    res.json({
      activities: rows || [],
      page,
      totalPages: Math.ceil(count / limit),
      totalActivities: count,
    });
  } catch (err) {
    console.error("GET ALL ACTIVITIES ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.getUserActivities = async (req, res) => {
  try {
    const { userId } = req.params;

    const activities = await Activity.findAll({
      where: { user_id: userId },
      include: [
        {
          model: AppointmentRequest,
          attributes: ['id', 'scheduled_date', 'status']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.json({ activities });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findByPk(id, {
      include: [
        { model: User, attributes: ['id', 'first_name', 'last_name'] },
        { model: AppointmentRequest, attributes: ['id', 'scheduled_date', 'status'] }
      ]
    });

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    return res.json(activity);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { activity_plan, analysis_id, request_id } = req.body;

    const activity = await Activity.findByPk(id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    if (request_id && request_id !== activity.request_id) {
      const appointment = await AppointmentRequest.findOne({
        where: { id: request_id, user_id: activity.user_id }
      });

      if (!appointment) {
        return res.status(400).json({
          message: "Takimi i zgjedhur nuk është valid për këtë pacient",
        });
      }

      activity.request_id = request_id;
    }

    if (activity_plan !== undefined) activity.activity_plan = activity_plan;
    if (analysis_id !== undefined) activity.analysis_id = analysis_id;

    await activity.save();

    if (req.user) {
      await createAuditLog({
        userId: req.user.id,
        username: req.user.username,
        role: req.user.role,
        action: "update",
        entity: "Activity",
        entityId: activity.id,
        description: `U përditësua aktiviteti me ID=${activity.id}`
      });
    }

    res.json(activity);
  } catch (err) {
    console.error("UPDATE ACTIVITY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findByPk(id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    await activity.destroy();

    if (req.user) {
      await createAuditLog({
        userId: req.user.id,
        username: req.user.username,
        role: req.user.role,
        action: "delete",
        entity: "Activity",
        entityId: activity.id,
        description: `U fshi aktiviteti me ID=${activity.id}`
      });
    }

    return res.json({ message: "Activity deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
