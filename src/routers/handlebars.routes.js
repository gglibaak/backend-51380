const express = require('express');
const handlebarsController = require('../controllers/handlebars.controller');

const hbsRoutes = express.Router();

hbsRoutes.get('/', handlebarsController.getAllProducts);

hbsRoutes.get('/products', handlebarsController.getProducts);

hbsRoutes.get('/carts/:cartId', handlebarsController.getCart);

module.exports = hbsRoutes;
