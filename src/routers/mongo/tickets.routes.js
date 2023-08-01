const express = require('express');
const ticketsController = require('../../controllers/tickets.controller');
const ticketsRoutes = express.Router();
const { isUserNotAdmin, isLoggedin } = require('../../middlewares/auth');


ticketsRoutes.put('/:cid/purchase', isLoggedin, isUserNotAdmin, ticketsController.purchaseCart);


module.exports = ticketsRoutes;
