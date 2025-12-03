const Activity = require('../../domain/models/Activity');
const AppointmentRequest = require('../../domain/models/AppointmentRequest');
const { Op } = require('sequelize');

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

    const activity = await Activity.create({ user_id, request_id, activity_plan });
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


exports.updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { activity_plan } = req.body;

    const activity = await Activity.findByPk(id);
    if (!activity) return res.status(404).json({ message: "Activity not found" });

    activity.activity_plan = activity_plan;
    await activity.save();

    return res.json({ message: "Activity updated", activity });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findByPk(id);
    if (!activity) return res.status(404).json({ message: "Activity not found" });

    await activity.destroy();
    return res.json({ message: "Activity deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
