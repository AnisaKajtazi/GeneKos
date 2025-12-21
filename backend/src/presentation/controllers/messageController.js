const messageService = require("../../services/messageService");

exports.getConversation = async (req, res) => {
  try {
    const messages = await messageService.getConversation(req.user, req.params.receiverId);
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { to, message } = req.body;
    const newMessage = await messageService.sendMessage(req.user, to, message);
    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.getUnreadMessages = async (req, res) => {
  try {
    const unreadMessages = await messageService.getUnreadMessages(req.user);
    res.json(unreadMessages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
