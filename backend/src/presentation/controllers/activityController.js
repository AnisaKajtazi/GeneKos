const Activity = require('../../domain/models/Activity');
const AppointmentRequest = require('../../domain/models/AppointmentRequest');
const User = require('../../domain/models/User');
const AuditLog = require('../../domain/models/AuditLog');
const { Op } = require('sequelize');


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
    const { user_id, request_id, activity_plan } = req.body;

    if (!user_id || !activity_plan)
      return res.status(400).json({ message: "User ID and activity plan are required" });

    let appointment = null;
    if (request_id) {
      appointment = await AppointmentRequest.findOne({
        where: { id: request_id, user_id }
      });
      if (!appointment) return res.status(404).json({ message: "Appointment not found for this user" });
    }

    const activity = await Activity.create({
      user_id,
      request_id,
      activity_plan,
      analysis_id
    });



    await createAuditLog({
      userId: req.user.id,
      username: req.user.username,
      role: req.user.role,
      action: "create",
      entity: "Activity",
      entityId: activity.id,
      description: `U krijua aktiviteti për user_id=${user_id}`
    });

    return res.status(201).json({ message: "Activity added successfully", activity });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getUserActivities = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const activities = await Activity.findAll({
      where: { user_id: userId },
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
    const activity = await Activity.findByPk(id);
    if (!activity) return res.status(404).json({ message: "Activity not found" });
    return res.json({ activity });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.findAll({
      include: [
        {
          model: User,
          attributes: ['first_name', 'last_name']
        },
        {
          model: AppointmentRequest,
          attributes: ['id', 'scheduled_date', 'status']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.json(activities);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { activity_plan, analysis_id } = req.body;

    const activity = await Activity.findByPk(id);
    if (!activity)
      return res.status(404).json({ message: "Activity not found" });

    activity.activity_plan = activity_plan || activity.activity_plan;
    activity.analysis_id = analysis_id ?? activity.analysis_id;

    await activity.save();

    return res.json({ message: "Activity updated successfully", activity });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findByPk(id);
    if (!activity)
      return res.status(404).json({ message: "Activity not found" });

    await activity.destroy();
    return res.json({ message: "Activity deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
