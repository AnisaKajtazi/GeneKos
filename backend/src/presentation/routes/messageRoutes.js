const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const authMiddleware = require("../../infrastructure/middleware/authMiddleware");

router.get("/conversation/:receiverId", authMiddleware, messageController.getConversation);

router.post("/send", authMiddleware, messageController.sendMessage);
router.get("/unread", authMiddleware, messageController.getUnreadMessages);

module.exports = router;
