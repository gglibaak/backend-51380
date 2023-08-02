const isUser = (req, res, next) => {
  if (req.session?.email) {
    return next();
  }
  return res.status(401).render('error', { error: 'Error de autenticacion.' });
};

const isAdmin = (req, res, next) => {
  if (req.session?.role === 'admin') {
    return next();
  }
  return res.status(403).render('error', { error: 'Error de autorización.' });
};

const isLoggedin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/products');
};

const redirectIfLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/products');
  }
  return next();
};

const isNotAdmin = (req, res, next) => {
  if (req.session?.role !== 'admin') {
    return next();
  }
  return res.status(403).render('error', { error: 'Error de autorización.' });
};

const isCartOwner = (req, res, next) => {
  if (req.session?.cartID === req.params.cid) {
    return next();
  }
  return res.status(403).render('error', { error: 'Error de autorización.' });
};

module.exports = { isUser, isAdmin, isLoggedin, redirectIfLoggedIn, isNotAdmin, isCartOwner };
