const messageRepo = require("../domain/repositories/messageRepository");

module.exports = {
  sendMessage: async (data) => {
    return await messageRepo.createMessage(data);
  },

  getConversation: async (user1, user2) => {
    return await messageRepo.getConversation(user1, user2);
  },
};
