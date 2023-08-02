const express = require('express');
const cartsController = require('../../controllers/carts.controller');
const cartRoutes = express.Router();
const { isUserNotAdmin, isLoggedin } = require('../../middlewares/auth');

cartRoutes.get('/carts', cartsController.getCartAll);

cartRoutes.get('/carts/:cid', cartsController.getCartById);

cartRoutes.post('/carts', cartsController.addCart);

cartRoutes.post('/carts/:cid/products/:pid', isUserNotAdmin, cartsController.addProduct);

cartRoutes.delete('/carts/:cid/products/:pid', cartsController.deleteProduct);

cartRoutes.put('/carts/:cid/products/:pid', cartsController.updateCartQty);

cartRoutes.delete('/carts/:cid', cartsController.deleteCart);

cartRoutes.put('/carts/:cid', cartsController.updateCart);

cartRoutes.put('/carts/:cid/purchase', isLoggedin, isUserNotAdmin, cartsController.purchaseCart);

cartRoutes.get('/carts/purchase/:cid', isLoggedin, isUserNotAdmin, cartsController.getTicketById);

module.exports = cartRoutes;
