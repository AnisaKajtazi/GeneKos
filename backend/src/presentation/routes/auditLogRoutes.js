const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');
const authMiddleware = require('../../infrastructure/middleware/authMiddleware');

router.get('/', authMiddleware, auditLogController.getAllAuditLogs);
router.delete('/:id', authMiddleware, auditLogController.deleteAuditLog);

module.exports = router;
