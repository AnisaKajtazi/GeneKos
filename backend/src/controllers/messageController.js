const messageService = require("../services/messageService");

module.exports = {
  sendMessage: async (req, res) => {
    try {
      const { receiver_id, message } = req.body;
      const sender_id = req.user.id;

      const newMsg = await messageService.sendMessage({
        sender_id,
        receiver_id,
        message
      });

      res.json(newMsg);
    } catch (err) {
      console.log("Send message error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getConversation: async (req, res) => {
    try {
      const user1 = req.user.id;
      const user2 = req.params.id;

      const chat = await messageService.getConversation(user1, user2);
      res.json(chat);
    } catch (err) {
      console.log("Get conversation error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
