const express = require('express');
const mailRoutes = express.Router();
const { isLogged, isUser } = require('../middlewares/auth');

const mailController = require('../controllers/mail.controller');

mailRoutes.get('/', isLogged, isUser, mailController.getMail);
mailRoutes.post('/send', isLogged, isUser, mailController.sendMail);

module.exports = mailRoutes;
