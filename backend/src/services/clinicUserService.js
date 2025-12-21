const bcrypt = require("bcryptjs");
const clinicUserRepository = require("../domain/repositories/clinicUserRepository");
const auditLogService = require("./auditLogService");

class ClinicUserService {
  async getAllClinicUsers(query) {
    return clinicUserRepository.findAll(query);
  }

  async createClinicUser(data, currentUser) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await clinicUserRepository.create({
      ...data,
      password: hashedPassword,
      role: "user",
      is_active: true,
    });

    if (currentUser) {
      await auditLogService.logAudit({
        userId: currentUser.id,
        username: currentUser.username,
        role: currentUser.role,
        action: "create",
        entity: "User",
        entityId: newUser.id,
        description: `Clinic created patient ${newUser.username}`,
      });
    }

    return newUser;
  }

  async updateClinicUser(id, data, currentUser) {
    const user = await clinicUserRepository.findById(id);
    if (!user || user.role !== "user") return null;

    if (data.password?.trim()) {
      data.password = await bcrypt.hash(data.password, 10);
    } else {
      delete data.password;
    }

    await clinicUserRepository.update(user, data);

    if (currentUser) {
      await auditLogService.logAudit({
        userId: currentUser.id,
        username: currentUser.username,
        role: currentUser.role,
        action: "update",
        entity: "User",
        entityId: user.id,
        description: `Clinic updated patient ${user.username}`,
      });
    }

    return user;
  }

  async deleteClinicUser(id, currentUser) {
    const user = await clinicUserRepository.findById(id);
    if (!user || user.role !== "user") return false;

    await clinicUserRepository.softDelete(user);

    if (currentUser) {
      await auditLogService.logAudit({
        userId: currentUser.id,
        username: currentUser.username,
        role: currentUser.role,
        action: "delete",
        entity: "User",
        entityId: user.id,
        description: `Clinic deleted patient ${user.username}`,
      });
    }

    return true;
  }
}

module.exports = new ClinicUserService();
