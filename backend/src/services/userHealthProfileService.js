const userHealthProfileRepository = require("../domain/repositories/userHealthProfileRepository");
const auditLogService = require("./auditLogService");

class UserHealthProfileService {
  async createProfile(data, currentUser) {
    const { user_id, request_id } = data;
    if (!user_id || !request_id) {
      throw new Error("User ID dhe Request ID janë të detyrueshme");
    }

    const appointment = await userHealthProfileRepository.findAppointmentById(request_id);
    if (!appointment) throw new Error("Takimi nuk u gjet");
    if (appointment.healthProfile) throw new Error("Ky takim ka tashmë një profil shëndetësor.");

    const profile = await userHealthProfileRepository.create(data);

    if (currentUser) {
      await auditLogService.logAudit({
        userId: currentUser.id,
        username: currentUser.username,
        role: currentUser.role,
        action: "create",
        entity: "UserHealthProfile",
        entityId: profile.id,
        description: `U krijua profili shëndetësor për user_id=${user_id} (request_id=${request_id})`,
      });
    }

    return profile;
  }

  async getProfileByUserId(userId) {
    return userHealthProfileRepository.findByUserId(userId);
  }

  async updateProfile(id, data, currentUser) {
    const profile = await userHealthProfileRepository.findById(id);
    if (!profile) return null;

    if (data.request_id && data.request_id !== profile.request_id) {
      const appointment = await userHealthProfileRepository.findAppointmentById(data.request_id);
      if (!appointment) throw new Error("Takimi nuk u gjet");
      profile.request_id = data.request_id;
    }

    const updatedProfile = await userHealthProfileRepository.update(profile, data);

    if (currentUser) {
      await auditLogService.logAudit({
        userId: currentUser.id,
        username: currentUser.username,
        role: currentUser.role,
        action: "update",
        entity: "UserHealthProfile",
        entityId: profile.id,
        description: `U përditësua profili shëndetësor me ID=${profile.id}`,
      });
    }

    return updatedProfile;
  }

  async deleteProfile(id, currentUser) {
    const profile = await userHealthProfileRepository.findById(id);
    if (!profile) return false;

    await userHealthProfileRepository.delete(profile);

    if (currentUser) {
      await auditLogService.logAudit({
        userId: currentUser.id,
        username: currentUser.username,
        role: currentUser.role,
        action: "delete",
        entity: "UserHealthProfile",
        entityId: id,
        description: `U fshi profili shëndetësor me ID=${id}`,
      });
    }

    return true;
  }
}

module.exports = new UserHealthProfileService();
