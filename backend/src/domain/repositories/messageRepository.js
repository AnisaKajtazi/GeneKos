  const Message = require("../models/messageModel");

  module.exports = {
    createMessage: (data) => Message.create(data),

    getConversation: (user1, user2) =>
      Message.findAll({
        where: {
          sender_id: [user1, user2],
          receiver_id: [user1, user2]
        },
        order: [["createdAt", "ASC"]],
      }),
  };
