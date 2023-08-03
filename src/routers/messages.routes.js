const express = require('express');
const messagesRoutes = express.Router();
const chatController = require('../controllers/messages.controller');
const { isNotAdmin, isLogged } = require('../middlewares/auth');

messagesRoutes.get('/', isLogged, isNotAdmin, chatController.getAllMessages);

module.exports = messagesRoutes;
