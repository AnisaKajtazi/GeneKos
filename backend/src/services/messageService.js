const { Op } = require("sequelize");
const Message = require("../domain/models/Message");

exports.getConversation = async (user, receiverId) => {
  const senderId = user.id;
  const role = user.role;

  let messages;

  if (role === "user") {
    messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: senderId, receiverId: null },
          { receiverId: senderId }
        ]
      },
      order: [["createdAt", "ASC"]],
    });

    await Message.update(
      { read: true },
      {
        where: {
          receiverId: senderId,
          senderId: { [Op.ne]: senderId },
          read: false
        }
      }
    );

  } else if (role === "clinic") {
    const patientId = receiverId;

    messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: patientId, receiverId: null },
          { receiverId: patientId }
        ]
      },
      order: [["createdAt", "ASC"]],
    });

    await Message.update(
      { read: true },
      {
        where: {
          senderId: patientId,
          receiverId: null,
          read: false
        }
      }
    );

  } else {
    messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ]
      },
      order: [["createdAt", "ASC"]],
    });

    await Message.update(
      { read: true },
      {
        where: {
          senderId: receiverId,
          receiverId: senderId,
          read: false
        }
      }
    );
  }

  return messages;
};

exports.sendMessage = async (user, to, content) => {
  const senderId = user.id;

  const newMessage = await Message.create({
    senderId,
    receiverId: to === "clinic" ? null : to,
    content,
    read: false
  });

  return newMessage;
};

exports.getUnreadMessages = async (user) => {
  const userId = user.id;

  return Message.findAll({
    where: {
      receiverId: userId,
      read: false,
    },
    order: [["createdAt", "ASC"]],
  });
};
