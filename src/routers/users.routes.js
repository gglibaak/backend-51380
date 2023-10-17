const express = require('express');
const userRoutes = express.Router();
const upload = require('../utils/multer.config');
const { checkDocuments, isAdmin, isLogged } = require('../middlewares/auth');

const usersController = require('../controllers/users.controller');

userRoutes.get('/premium/:uid', checkDocuments, usersController.getPremium);

userRoutes.post('/:uid/documents', isLogged, upload, usersController.uploadDocuments);

userRoutes.get('/:uid/documents', isLogged, usersController.getDocuments);

userRoutes.get('/', isAdmin, usersController.getUsers);

userRoutes.delete('/:uid', isAdmin, usersController.deleteUser);

userRoutes.get('/view', isAdmin, usersController.getUserView);

module.exports = userRoutes;
