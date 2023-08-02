const express = require('express');
const chatRoutes = express.Router();
const chatController = require('../../controllers/chat.controller');
const { isNotAdmin, isLoggedin } = require('../../middlewares/auth');

chatRoutes.get('/', isLoggedin, isNotAdmin, chatController.getAllMessages);

module.exports = chatRoutes;
