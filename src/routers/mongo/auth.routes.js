const express = require('express');
const passport = require('passport');
const { redirectIfLoggedIn, isLoggedin } = require('../../middlewares/auth');

const authRoutes = express.Router();

authRoutes.get('/login', redirectIfLoggedIn, (req, res) => {
  return res.render('login', {});
});

authRoutes.get('/register', redirectIfLoggedIn, (req, res) => {
  return res.render('register', {});
});

authRoutes.post('/login', passport.authenticate('login', { failureRedirect: '/auth/fail-register' }), async (req, res) => {
  req.session.email = req.user.email;
  req.session.role = req.user.role;
  req.session.first_name = req.user.first_name;
  req.session.last_name = req.user.last_name;
  req.session.age = req.user.age;
  req.session.cartID = req.user.cartID;

  return res.redirect('/products');
});

authRoutes.post('/register', passport.authenticate('register', { failureRedirect: '/auth/fail-register' }), async (req, res) => {
  const { first_name, last_name, email, age } = req.body;

  req.session.email = email;
  req.session.role = 'user';
  req.session.first_name = first_name;
  req.session.last_name = last_name;
  req.session.age = age;
  req.session.cartID = req.user.cartID;

  return res.redirect('/products');
});

authRoutes.get('/fail-register', (req, res) => {
  const { error } = req.flash();
  return res.status(400).render('error', { error });
});

authRoutes.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.json({ status: 'error', body: err });
    }
  });
  return res.redirect('/auth/login');
});

authRoutes.get('/profile', isLoggedin, (req, res) => {
  const role = req.session.role === 'admin' ? 'Administrador' : 'Usuario Estándar';
  return res.render('profile', {
    firstname: req.session.first_name,
    lastname: req.session.last_name,
    email: req.session.email,
    isadmin: role,
    age: req.session.age,
    cartid: req.session.cartID,
  });
});

authRoutes.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

authRoutes.get('/github/callback', passport.authenticate('github', { failureRedirect: '/auth/fail-register' }), (req, res) => {
  req.session.email = req.user.email;
  req.session.role = req.user.role;
  req.session.first_name = req.user.first_name;
  req.session.last_name = req.user.last_name;
  req.session.age = req.user.age;
  req.session.cartID = req.user.cartID;
  return res.redirect('/products');
});

authRoutes.get('/facebook', passport.authorize('facebook', { scope: ['email'] }));

authRoutes.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/fail-register' }),
  (req, res) => {
    req.session.email = req.user.email;
    req.session.role = req.user.role;
    req.session.first_name = req.user.first_name;
    req.session.last_name = req.user.last_name;
    req.session.age = req.user.age;
    req.session.cartID = req.user.cartID;
    return res.redirect('/products');
  }
);

authRoutes.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRoutes.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/fail-register' }), (req, res) => {
  req.session.email = req.user.email;
  req.session.role = req.user.role;
  req.session.first_name = req.user.first_name;
  req.session.last_name = req.user.last_name;
  req.session.age = req.user.age;
  req.session.cartID = req.user.cartID;
  return res.redirect('/products');
});

module.exports = authRoutes;
