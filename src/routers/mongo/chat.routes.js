const express = require('express');
const chatRoutes = express.Router();
const chatController = require('../../controllers/chat.controller');

chatRoutes.get('/', chatController.getAllMessages);

module.exports = chatRoutes;
