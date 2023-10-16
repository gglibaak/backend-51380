const express = require('express');
const userRoutes = express.Router();
const upload = require('../utils/multer.config');
const { checkDocuments } = require('../middlewares/auth');

const usersController = require('../controllers/users.controller');

userRoutes.get('/premium/:uid', checkDocuments, usersController.getPremium);

userRoutes.post('/:uid/documents', upload, usersController.uploadDocuments);

userRoutes.get('/:uid/documents', usersController.getDocuments);

userRoutes.get('/', usersController.getUsers);

userRoutes.delete('/:uid', usersController.deleteUser);

userRoutes.get('/view', usersController.getUserView); //TODO middlewares de acceso

module.exports = userRoutes;
