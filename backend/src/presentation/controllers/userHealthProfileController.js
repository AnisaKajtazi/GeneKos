const UserHealthProfile = require('../../domain/models/UserHealthProfile');
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
      description
    });
  } catch (err) {
    console.error("Audit log error:", err);
  }
};

exports.createProfile = async (req, res) => {
  try {
    const { user_id, request_id, height, weight, blood_type, allergies, medical_conditions, medications } = req.body;

    if (!user_id || !request_id) {
      return res.status(400).json({ message: "User ID dhe Request ID janë të detyrueshme" });
    }

    const appointment = await AppointmentRequest.findByPk(request_id, {
      include: [{ model: UserHealthProfile, as: "healthProfile" }]
    });

    if (!appointment) {
      return res.status(404).json({ message: "Takimi nuk u gjet" });
    }

    if (appointment.healthProfile) {
      return res.status(400).json({ message: "Ky takim ka tashmë një profil shëndetësor." });
    }

    const profile = await UserHealthProfile.create({ user_id, request_id, height, weight, blood_type, allergies, medical_conditions, medications });

    if (req.user) {
      await createAuditLog({
        userId: req.user.id,
        username: req.user.username,
        role: req.user.role,
        action: "create",
        entity: "UserHealthProfile",
        entityId: profile.id,
        description: `U krijua profili shëndetësor për user_id=${user_id} (request_id=${request_id})`
      });
    }

    return res.status(201).json(profile);
  } catch (err) {
    console.error("CREATE PROFILE ERROR:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.getProfileByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const profiles = await UserHealthProfile.findAll({
      where: { user_id: userId },
      include: [
        {
          model: AppointmentRequest,
          as: "appointment",
          attributes: ["id", "scheduled_date", "status"]
        }
      ],
      order: [["created_at", "DESC"]]
    });

    return res.json(profiles);
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      height,
      weight,
      blood_type,
      allergies,
      medical_conditions,
      medications,
      request_id
    } = req.body;

    const profile = await UserHealthProfile.findByPk(id);
    if (!profile) {
      return res.status(404).json({ message: "Profili nuk u gjet" });
    }

    if (request_id && request_id !== profile.request_id) {
      const appointment = await AppointmentRequest.findByPk(request_id);
      if (!appointment) {
        return res.status(404).json({ message: "Takimi nuk u gjet" });
      }
      profile.request_id = request_id;
    }

    profile.height = height ?? profile.height;
    profile.weight = weight ?? profile.weight;
    profile.blood_type = blood_type ?? profile.blood_type;
    profile.allergies = allergies ?? profile.allergies;
    profile.medical_conditions = medical_conditions ?? profile.medical_conditions;
    profile.medications = medications ?? profile.medications;

    await profile.save();

    if (req.user) {
      await createAuditLog({
        userId: req.user.id,
        username: req.user.username,
        role: req.user.role,
        action: "update",
        entity: "UserHealthProfile",
        entityId: profile.id,
        description: `U përditësua profili shëndetësor me ID=${profile.id}`
      });
    }

    return res.json(profile);
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await UserHealthProfile.findByPk(id);
    if (!profile) {
      return res.status(404).json({ message: "Profili nuk u gjet" });
    }

    await profile.destroy();

    if (req.user) {
      await createAuditLog({
        userId: req.user.id,
        username: req.user.username,
        role: req.user.role,
        action: "delete",
        entity: "UserHealthProfile",
        entityId: id,
        description: `U fshi profili shëndetësor me ID=${id}`
      });
    }

    return res.json({ message: "Profili u fshi me sukses" });
  } catch (err) {
    console.error("DELETE PROFILE ERROR:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
