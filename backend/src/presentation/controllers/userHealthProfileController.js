const UserHealthProfile = require('../../domain/models/UserHealthProfile');
const User = require('../../domain/models/User');
const AuditLog = require('../../domain/models/AuditLog');

const createAuditLog = async ({ userId, username, role, action, entity, entityId, description }) => {
  try {
    await AuditLog.create({ user_id: userId, username, role, action, entity, entity_id: entityId, description });
  } catch (err) {
    console.error("Audit log error:", err);
  }
};

exports.createProfile = async (req, res) => {
  try {
    const { user_id, height, weight, blood_type, allergies, medical_conditions, medications } = req.body;
    if (!user_id) return res.status(400).json({ message: "User ID is required" });

    const profile = await UserHealthProfile.create({
      user_id, height, weight, blood_type, allergies, medical_conditions, medications
    });

    if (req.user) {
      await createAuditLog({
        userId: req.user.id,
        username: req.user.username,
        role: req.user.role,
        action: "create",
        entity: "UserHealthProfile",
        entityId: profile.id,
        description: `U krijua profile shëndetësor për user_id=${user_id}`
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
      order: [['createdAt', 'DESC']],
    });
    if (!profiles || profiles.length === 0) {
      return res.status(404).json({ message: "No profiles found" });
    }
    return res.json(profiles);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { height, weight, blood_type, allergies, medical_conditions, medications } = req.body;

    const profile = await UserHealthProfile.findByPk(id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    profile.height = height ?? profile.height;
    profile.weight = weight ?? profile.weight;
    profile.blood_type = blood_type ?? profile.blood_type;
    profile.allergies = allergies ?? profile.allergies;
    profile.medical_conditions = medical_conditions ?? profile.medical_conditions;
    profile.medications = medications ?? profile.medications;

    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await UserHealthProfile.findByPk(id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    await profile.destroy();
    return res.json({ message: "Profile deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
