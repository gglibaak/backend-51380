const express = require('express');
const productsController = require('../controllers/products.controller');
const productRoutes = express.Router();
const { isLogged, isAdmin } = require('../middlewares/auth');

productRoutes.get('/products', isLogged, productsController.getProductAll);

productRoutes.get('/products/:pid', isLogged, productsController.getProductById);

productRoutes.post('/products', isLogged, isAdmin, productsController.addProduct);

productRoutes.put('/products/:pid', isLogged, isAdmin, productsController.updateProduct);

productRoutes.delete('/products/:pid', isLogged, isAdmin, productsController.deleteProduct);

module.exports = productRoutes;
