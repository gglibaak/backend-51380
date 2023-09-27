const express = require('express');
const userRoutes = express.Router();

const usersController = require('../controllers/users.controller');

userRoutes.get('/premium/:uid', usersController.getPremium);

module.exports = userRoutes;
