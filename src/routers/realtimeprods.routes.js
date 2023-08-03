const express = require('express');
const { isAdmin, isLogged } = require('../middlewares/auth');
const realTimeProdController = require('../controllers/realtimeprods.controller');
const realTimeProdRoutes = express.Router();

realTimeProdRoutes.get('/', isLogged, isAdmin, realTimeProdController.getRealTimeProd);

module.exports = realTimeProdRoutes;
