const messageModel = require("../Models/messageModel");
const sendResponse = require("../middleware/responseHandler");

const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new messageModel({
    chatId, senderId, text
  })
  try {
    const response = await message.save();
    return sendResponse(res, '', 200, response);
  } catch (error) {
    console.log(error);
    return sendResponse(res, error, 500)
  }
}

const getMessages = async (req, res) => {
  const chatId = req.params.chatId;
  try {
    const messages = await messageModel.find({ chatId });
    return sendResponse(res, '', 200, messages);
  } catch (error) {
    console.log(error);
    return sendResponse(res, error, 500)
  }
}

module.exports = { createMessage, getMessages }