const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const userModel = require("../Models/userModel");
const sendResponse = require("../middleware/responseHandler")
const { errorMessages } = require("../errorMessages");

const createToken = (_id) => {
  const jwtKey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtKey, { expiresIn: "3d" })
}

const sendTokenResponse = (res, user) => {
  const token = createToken(user._id);
  return sendResponse(res, '', 200, { _id: user._id, name: user.name, email: user.email, token });
}

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (user)
      return sendResponse(res, errorMessages.userAlreadyExists, 400);

    if (!name || !email || !password)
      return sendResponse(res, errorMessages.allFieldsRequired, 400);

    if (!validator.isEmail(email))
      return sendResponse(res, errorMessages.notValidEmail, 400);

    if (!validator.isStrongPassword(password))
      return sendResponse(res, errorMessages.notStrongPassword, 400);

    user = new userModel({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    return sendTokenResponse(res, user);
  } catch (error) {
    console.log(error);
    return sendResponse(res, error, 500);
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return sendResponse(res, errorMessages.allFieldsRequired, 400);

  try {
    let user = await userModel.findOne({ email });

    if (!user) return sendResponse(res, errorMessages.userWithSuchEmailNotRegister, 400);

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return sendResponse(res, errorMessages.invalidPassword, 400);

    return sendTokenResponse(res, user);
  } catch (error) {
    console.log(error);
    return sendResponse(res, error, 500);
  }
}

const findUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userModel.findById(userId);;
    if (!user) return sendResponse(res, errorMessages.userNotFound, 400);
    return sendResponse(res, '', 200, user);
  } catch (error) {
    console.log(error);
    return sendResponse(res, error, 500);
  }
}

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    return sendResponse(res, '', 200, users);
  } catch (error) {
    console.log(error);
    return sendResponse(res, error, 500);
  }
}

module.exports = { register, login, findUser, getUsers };