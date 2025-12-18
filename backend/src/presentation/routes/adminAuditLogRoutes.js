const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditLogController');

router.get('/audit-logs', auditController.getAllAuditLogs);
router.delete('/audit-logs/:id', auditController.deleteAuditLog);

module.exports = router;
