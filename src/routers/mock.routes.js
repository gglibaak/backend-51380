const express = require('express');
const mockController = require('../controllers/mock.controller');
const mockRoutes = express.Router();

mockRoutes.get('/mockingproducts', mockController.getMockgingProducts);

module.exports = mockRoutes;
