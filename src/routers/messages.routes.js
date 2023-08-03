const express = require('express');
const messagesRoutes = express.Router();
const chatController = require('../controllers/messages.controller');
const { isNotAdmin, isLoggedin } = require('../middlewares/auth');

messagesRoutes.get('/', isLoggedin, isNotAdmin, chatController.getAllMessages);

module.exports = messagesRoutes;
