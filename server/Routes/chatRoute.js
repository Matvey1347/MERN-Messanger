const express = require("express");
const {
  createChat,
  updateChat,
  deleteChat,
  findUserChats,
  findChatById,
  getChatUsers
} = require("../Controllers/chatController");

const router = express.Router();

router.post("/", createChat);
router.put("/:chatId", updateChat);
router.delete("/:chatId", deleteChat);
router.get("/:userId", findUserChats);
router.get("/find/:chatId", findChatById);
router.get("/users/:chatId", getChatUsers);

module.exports = router;