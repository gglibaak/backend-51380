const express = require('express');
const passport = require('passport');
const { redirectIfLoggedIn, isLogged } = require('../middlewares/auth');
const authController = require('../controllers/auth.controller');
const authRoutes = express.Router();

authRoutes.get('/login', redirectIfLoggedIn, authController.getLogin);

authRoutes.get('/register', redirectIfLoggedIn, authController.getRegister);

authRoutes.post(
  '/login',
  passport.authenticate('login', { failureRedirect: '/auth/fail-register' }),
  authController.passportLogin
);

authRoutes.post(
  '/register',
  passport.authenticate('register', { failureRedirect: '/auth/fail-register' }),
  authController.passportRegister
);

authRoutes.get('/fail-register', authController.failRegister);

authRoutes.get('/logout', authController.logout);

authRoutes.get('/profile', isLogged, authController.getProfile);

authRoutes.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

authRoutes.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/fail-register' }),
  authController.githubCallback
);

authRoutes.get('/facebook', passport.authorize('facebook', { scope: ['email'] }));

authRoutes.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/fail-register' }),
  authController.facebookCallback
);

authRoutes.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRoutes.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/fail-register' }),
  authController.googleCallback
);

authRoutes.get('/password-recovery', authController.getPasswordRecovery);

authRoutes.post('/password-recovery', authController.postPasswordRecovery);

authRoutes.get('/password-recovery/:token', authController.getPasswordReset);

authRoutes.post('/password-recovery/:token', authController.postPasswordReset);

module.exports = authRoutes;
