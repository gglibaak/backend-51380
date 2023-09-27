const express = require('express');
const handlebarsController = require('../controllers/handlebars.controller');
const { isLogged, isCartOwner } = require('../middlewares/auth');

const hbsRoutes = express.Router();

hbsRoutes.get('/', handlebarsController.getHome);

hbsRoutes.get('/products', handlebarsController.getProducts);

hbsRoutes.get('/carts/:cid', isLogged, isCartOwner, handlebarsController.getCart);

hbsRoutes.get('/loggertest', handlebarsController.getLoggertest);

module.exports = hbsRoutes;
