const express = require('express');
const cartsController = require('../controllers/carts.controller');
const cartRoutes = express.Router();
const { isNotAdmin, isLoggedin, isCartOwner, isAdmin } = require('../middlewares/auth');

cartRoutes.get('/carts', cartsController.getCartAll);

cartRoutes.get('/carts/:cid', cartsController.getCartById);

cartRoutes.post('/carts', cartsController.addCart);

cartRoutes.post('/carts/:cid/products/:pid', isNotAdmin, isCartOwner, cartsController.addProduct);

cartRoutes.delete('/carts/:cid/products/:pid', isAdmin, cartsController.deleteProduct);

cartRoutes.put('/carts/:cid/products/:pid', isAdmin, cartsController.updateCartQty);

cartRoutes.delete('/carts/:cid', cartsController.deleteCart);

cartRoutes.put('/carts/:cid', cartsController.updateCart);

cartRoutes.put('/carts/:cid/purchase', isLoggedin, isNotAdmin, cartsController.purchaseCart);

cartRoutes.get('/carts/purchase/:cid', isLoggedin, isNotAdmin, cartsController.getTicketById);

module.exports = cartRoutes;
