const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const auth = require("../../infrastructure/middleware/authMiddleware");

router.post("/send", auth, messageController.sendMessage);
router.get("/conversation/:id", auth, messageController.getConversation);

module.exports = router;
