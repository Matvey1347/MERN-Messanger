const chatModel = require("../Models/chartModel");
const userModel = require("../Models/userModel");
const messageModel = require("../Models/messageModel");
const { errorMessages, successMessages } = require("../errorMessages");
const sendResponse = require("../middleware/responseHandler");

const createChat = async (req, res) => {
  const { members, name } = req.body;

  try {

    const chat = await chatModel.findOne({
      // members: { $all: userIds },
      name
    });

    if (chat) return sendResponse(res, '', 200, chat);

    const newChat = new chatModel({
      members,
      name: name || "Communication"
    });
    const response = await newChat.save();

    return sendResponse(res, '', 200, response);
  } catch (error) {
    console.log(error);
    return sendResponse(res, error, 500)
  }
}

const updateChat = async (req, res) => {
  const chatId = req.params.chatId;
  const { members, name } = req.body;

  try {
    const chat = await chatModel.findOne({
      _id: chatId
    });

    if (!chat) return sendResponse(res, errorMessages.chatNotFound, 400, chat);
    chat.members = members;
    if (name) chat.name = name;
    const response = await chat.save();

    return sendResponse(res, '', 200, response);
  } catch (error) {
    console.log(error);
    return sendResponse(res, error, 500)
  }
}

const deleteChat = async (req, res) => {
  const chatId = req.params.chatId;
  try {
    await chatModel.deleteOne({ _id: chatId });
    await messageModel.deleteMany({ chatId });
    return sendResponse(res, successMessages.chatDeleteSuccessfully, 200);
  } catch (error) {
    console.log(error);
    return sendResponse(res, error, 500)
  }
}

const findUserChats = async (req, res) => {
  const userId = req.params.userId;
  try {
    const chats = await chatModel.find({
      members: { $in: [userId] }
    });

    return sendResponse(res, '', 200, chats);
  } catch (error) {
    console.log(error);
    return sendResponse(res, error, 500)
  }
}

const findChatById = async (req, res) => {
  const chatId = req.params.chatId;
  try {
    const chat = await chatModel.findOne({
      _id: chatId
    });

    return sendResponse(res, '', 200, chat);
  } catch (error) {
    console.log(error);
    return sendResponse(res, error, 500)
  }
}

const getChatUsers = async (req, res) => {
  const chatId = req.params.chatId;
  try {
    const chat = await chatModel.findOne({
      _id: chatId
    }).populate('members');;

    if (chat) {
      const users = await userModel.find({ _id: { $in: chat.members } });
      return sendResponse(res, '', 200, users);
    } else {
      return sendResponse(res, errorMessages.chatNotFound, 400);
    }
  } catch (error) {
    console.log(error);
    return sendResponse(res, error, 500)
  }
}


module.exports = { createChat, updateChat, deleteChat, findUserChats, findChatById, getChatUsers };