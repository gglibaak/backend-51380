const express = require('express');
const cartsController = require('../controllers/carts.controller');
const cartRoutes = express.Router();
const { isNotAdmin, isLogged, isCartOwner, isAdmin } = require('../middlewares/auth');

cartRoutes.get('/carts', cartsController.getCartAll);

cartRoutes.get('/carts/:cid', cartsController.getCartById);

cartRoutes.post('/carts', cartsController.addCart);

cartRoutes.post('/carts/:cid/products/:pid', isNotAdmin, isCartOwner, cartsController.addProduct);

cartRoutes.delete('/carts/:cid/products/:pid', isAdmin, cartsController.deleteProduct);

cartRoutes.put('/carts/:cid/products/:pid', isAdmin, cartsController.updateCartQty);

cartRoutes.delete('/carts/:cid', isAdmin, cartsController.deleteCart);

cartRoutes.put('/carts/:cid', cartsController.updateCart);

cartRoutes.put('/carts/:cid/purchase', isLogged, isNotAdmin, cartsController.purchaseCart);

cartRoutes.get('/carts/purchase/:cid', isLogged, isNotAdmin, cartsController.getTicketById);

module.exports = cartRoutes;
