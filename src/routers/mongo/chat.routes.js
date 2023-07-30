const express = require('express');
const chatRoutes = express.Router();
const chatController = require('../../controllers/chat.controller');
const { isUserNotAdmin, isLoggedin } = require('../../middlewares/auth');

chatRoutes.get('/', isLoggedin, isUserNotAdmin, chatController.getAllMessages);

module.exports = chatRoutes;
