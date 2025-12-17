const Activity = require('../../domain/models/Activity');
const AppointmentRequest = require('../../domain/models/AppointmentRequest');

exports.createActivity = async (req, res) => {
  try {
    const { user_id, request_id, activity_plan, analysis_id } = req.body;

    if (!user_id || !activity_plan)
      return res.status(400).json({ message: "User ID and activity plan are required" });

    if (request_id) {
      const appointment = await AppointmentRequest.findOne({
        where: { id: request_id, user_id }
      });

      if (!appointment)
        return res.status(404).json({ message: "Appointment not found for this user" });
    }

    const activity = await Activity.create({
      user_id,
      request_id,
      activity_plan,
      analysis_id
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

    const activities = await Activity.findAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
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

    if (!activity)
      return res.status(404).json({ message: "Activity not found" });

    return res.json({ activity });
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
