const express = require('express');
const { isLogged, hasPrivileges } = require('../middlewares/auth');
const realTimeProdController = require('../controllers/realtimeprods.controller');
const realTimeProdRoutes = express.Router();

realTimeProdRoutes.get('/', isLogged, hasPrivileges, realTimeProdController.getRealTimeProd);

module.exports = realTimeProdRoutes;
