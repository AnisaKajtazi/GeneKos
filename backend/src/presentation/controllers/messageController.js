const Message = require("../../domain/models/Message");
const { Op } = require("sequelize");


exports.getConversation = async (req, res) => {
  const { receiverId } = req.params;
  const senderId = req.user.id;
  const role = req.user.role;

  try {
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

    return res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


exports.sendMessage = async (req, res) => {
  const { to, message } = req.body;
  const senderId = req.user.id;

  try {
    const newMessage = await Message.create({
      senderId,
      receiverId: to === "clinic" ? null : to, 
      content: message,
      read: false
    });

    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


exports.getUnreadMessages = async (req, res) => {
  try {
    const userId = req.user.id;

    const unreadMessages = await Message.findAll({
      where: {
        receiverId: userId,
        read: false,
      },
      order: [["createdAt", "ASC"]],
    });

    res.json(unreadMessages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
