const express = require('express');
const mailRoutes = express.Router();
const { isLoggedin } = require('../middlewares/auth');

const mailController = require('../controllers/mail.controller');

mailRoutes.get('/', isLoggedin, mailController.getMail);
mailRoutes.post('/send', mailController.sendMail);

module.exports = mailRoutes;
