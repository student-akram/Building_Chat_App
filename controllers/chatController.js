const Message = require('../models/message');

exports.sendMessage = async (req, res) => {

  try {

    const { message } = req.body;

    const userId = req.user.id; // from JWT middleware

    const newMessage = await Message.create({
      message: message,
      userId: userId
    });

    res.status(201).json({
      success: true,
      data: newMessage
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};