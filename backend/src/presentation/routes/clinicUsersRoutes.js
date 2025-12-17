const express = require("express");
const router = express.Router();

const authMiddleware = require("../../infrastructure/middleware/authMiddleware");
const authorizeRole = require("../../infrastructure/middleware/authorizeRole");

const clinicUsersController = require("../controllers/clinicUsersController");

router.use(authMiddleware);
router.use(authorizeRole(["clinic"]));

router.get("/", clinicUsersController.getAllClinicUsers);
router.post("/", clinicUsersController.createClinicUser);
router.put("/:id", clinicUsersController.updateClinicUser);
router.delete("/:id", clinicUsersController.deleteClinicUser);

module.exports = router;
