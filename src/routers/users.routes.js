const express = require('express');
const userRoutes = express.Router();
const upload = require('../utils/multer.config');

const usersController = require('../controllers/users.controller');

userRoutes.get('/premium/:uid', usersController.getPremium);

userRoutes.post(
  '/:uid/documents',
  upload.fields([
    { name: 'documents', maxCount: 3 },
    { name: 'profiles', maxCount: 3 },
    { name: 'products', maxCount: 3 },
  ]),
  usersController.uploadDocuments
);

module.exports = userRoutes;
