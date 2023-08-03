const express = require('express');
const productsController = require('../controllers/products.controller');
const productRoutes = express.Router();

productRoutes.get('/products', productsController.getProductAll);

productRoutes.get('/products/:pid', productsController.getProductById);

productRoutes.post('/products', productsController.addProduct);

productRoutes.put('/products/:pid', productsController.updateProduct);

productRoutes.delete('/products/:pid', productsController.deleteProduct);

module.exports = productRoutes;
