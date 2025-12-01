const Message = require("../domain/models/Message");

const getMessagesBetween = async (senderId, receiverId) => {
  return Message.findAll({
    where: {
      senderId,
      receiverId
    },
    order: [["createdAt", "ASC"]],
  });
};

const saveMessage = async (senderId, receiverId, content) => {
  return Message.create({ senderId, receiverId, content });
};

module.exports = { getMessagesBetween, saveMessage };
