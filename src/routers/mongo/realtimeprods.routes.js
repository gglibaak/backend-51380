const express = require('express');
const { isAdmin } = require('../../middlewares/auth');
const realTimeProdController = require('../../controllers/realtimeprods.controller');
const realTimeProdRoutes = express.Router();

realTimeProdRoutes.get('/', isAdmin, realTimeProdController.getRealTimeProd);

module.exports = realTimeProdRoutes;
