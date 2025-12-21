const activityService = require("../../services/activityService");

exports.createActivity = async (req, res) => {
  try {
    const activity = await activityService.createActivity(req.body, req.user);
    res.status(201).json(activity);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

exports.getAllActivities = async (req, res) => {
  try {
    const activities = await activityService.getAllActivities(req.query);
    res.json(activities);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

exports.getUserActivities = async (req, res) => {
  try {
    const activities = await activityService.getUserActivities(req.params.userId);
    res.json({ activities });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

exports.getActivityById = async (req, res) => {
  try {
    const activity = await activityService.getActivityById(req.params.id);
    res.json(activity);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

exports.updateActivity = async (req, res) => {
  try {
    const activity = await activityService.updateActivity(req.params.id, req.body, req.user);
    res.json(activity);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    await activityService.deleteActivity(req.params.id, req.user);
    res.json({ message: "Activity deleted successfully" });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};
