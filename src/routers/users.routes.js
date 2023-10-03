const express = require('express');
const userRoutes = express.Router();
const upload = require('../utils/multer.config');
const { checkDocuments } = require('../middlewares/auth');

const usersController = require('../controllers/users.controller');

userRoutes.get('/premium/:uid', checkDocuments, usersController.getPremium);

userRoutes.post('/:uid/documents', upload, usersController.uploadDocuments);

module.exports = userRoutes;
