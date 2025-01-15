const express = require("express");
const { register, login, findUser, getUsers } = require("../Controllers/userController")

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user/:userId", findUser);
router.get("/", getUsers);

module.exports = router;