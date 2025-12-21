const { Op, Sequelize } = require("sequelize");
const activityRepository = require("../domain/repositories/activityRepository");
const AppointmentRequest = require("../domain/models/AppointmentRequest");
const { logAudit } = require("./auditLogService");

class ActivityService {
  async createActivity(data, user) {
    const { user_id, request_id, activity_plan, analysis_id } = data;
    if (!user_id || !request_id || !activity_plan)
      throw { status: 400, message: "User ID, appointment dhe activity plan janë të detyrueshme" };

    const appointment = await AppointmentRequest.findOne({ where: { id: request_id, user_id } });
    if (!appointment) throw { status: 404, message: "Takimi i zgjedhur nuk ekziston për këtë pacient" };

    const activity = await activityRepository.create({ user_id, request_id, activity_plan, analysis_id: analysis_id || null });

    await logAudit({ user, action: "create", entity: "Activity", entityId: activity.id, description: `U krijua aktivitet për request_id=${request_id}` });

    return activity;
  }

  async getAllActivities(query) {
    let { page = 1, limit = 10, search = "" } = query;
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;

    const whereClause = {};
    if (search && search.trim() !== "") {
      search = search.trim().toLowerCase();
      whereClause[Op.or] = [
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("activity_plan")), "LIKE", `%${search}%`),
        Sequelize.literal(`EXISTS (
          SELECT 1 FROM Users AS u
          WHERE u.id = Activity.user_id
          AND LOWER(CONCAT(u.first_name, ' ', u.last_name)) LIKE '%${search}%'
        )`),
      ];
    }

    const { rows, count } = await activityRepository.findAll(whereClause, page, limit);
    return { activities: rows || [], page, totalPages: Math.ceil(count / limit), totalActivities: count };
  }

  async getUserActivities(userId) {
    if (!userId) throw { status: 400, message: "User ID is required" };
    return activityRepository.findByUser(userId);
  }

  async getActivityById(id) {
    const activity = await activityRepository.findById(id);
    if (!activity) throw { status: 404, message: "Activity not found" };
    return activity;
  }

  async updateActivity(id, data, user) {
    const activity = await activityRepository.findById(id);
    if (!activity) throw { status: 404, message: "Activity not found" };

    const { activity_plan, analysis_id, request_id } = data;

    if (request_id && request_id !== activity.request_id) {
      const appointment = await AppointmentRequest.findOne({ where: { id: request_id, user_id: activity.user_id } });
      if (!appointment) throw { status: 400, message: "Takimi i zgjedhur nuk është valid për këtë pacient" };
      activity.request_id = request_id;
    }

    if (activity_plan !== undefined) activity.activity_plan = activity_plan;
    if (analysis_id !== undefined) activity.analysis_id = analysis_id;

    const updatedActivity = await activityRepository.update(activity, activity);

    await logAudit({ user, action: "update", entity: "Activity", entityId: updatedActivity.id, description: `U përditësua aktiviteti me ID=${updatedActivity.id}` });

    return updatedActivity;
  }

  async deleteActivity(id, user) {
    const activity = await activityRepository.findById(id);
    if (!activity) throw { status: 404, message: "Activity not found" };

    await activityRepository.delete(activity);

    await logAudit({ user, action: "delete", entity: "Activity", entityId: activity.id, description: `U fshi aktiviteti me ID=${activity.id}` });
  }
}

module.exports = new ActivityService();
