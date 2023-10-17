const UserServices = require('../services/users.services');
const userService = new UserServices();

const isUser = (req, res, next) => {
  if (process.env.NODE_ENV === 'DEVELOPMENT' && !req.isAuthenticated()) {
    return next();
  }
  if (req.session?.email) {
    return next();
  }
  return res.status(401).render('error', { error: 'Error de autenticacion.' });
};

const isAdmin = (req, res, next) => {
  if (process.env.NODE_ENV === 'DEVELOPMENT' && !req.isAuthenticated()) {
    return next();
  }
  if (req.session?.role === 'admin') {
    return next();
  }
  return res.status(403).render('error', { error: 'Error de autorización.' });
};

const hasPrivileges = (req, res, next) => {
  if (process.env.NODE_ENV === 'DEVELOPMENT' && !req.isAuthenticated()) {
    return next();
  }
  if (req.session?.role === 'admin' || req.session?.role === 'premium') {
    return next();
  }
  return res.status(403).render('error', { error: 'Error de autorización.' });
};

const isLogged = (req, res, next) => {
  if (process.env.NODE_ENV === 'DEVELOPMENT' && !req.isAuthenticated()) {
    return next();
  }

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
  if (process.env.NODE_ENV === 'DEVELOPMENT' && !req.isAuthenticated()) {
    return next();
  }

  if (req.session?.role !== 'admin') {
    return next();
  }
  return res.status(403).render('error', { error: 'Error de autorización.' });
};

const isCartOwner = (req, res, next) => {
  if (process.env.NODE_ENV === 'DEVELOPMENT' && !req.isAuthenticated()) {
    return next();
  }
  if (req.session?.cartID === req.params.cid) {
    return next();
  }
  return res.status(403).render('error', { error: 'Error de autorización.' });
};

const checkDocuments = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'DEVELOPMENT' && !req.isAuthenticated()) {
      return next();
    }

    if (req.session?.role == 'admin') {
      //Permite que el admin pueda modificar el perfil de cualquier usuario
      return next();
    }

    const user = await userService.getProfile({ _id: req.params.uid });

    if (!user) {
      return res.status(403).render('error', { error: 'Error de autorización.' });
    }

    const documents = user.result.payload.documents;

    if (!documents || documents.length === 0)
      return res.status(403).render('error', {
        error: 'Uno o mas documentos no estan cargados en nuestro sistema, por favor actualice antes de continuar.',
      });

    const checkData =
      documents.some((doc) => doc.name === 'idDoc') &&
      documents.some((doc) => doc.name === 'addressDoc') &&
      documents.some((doc) => doc.name === 'accDoc');

    if (!checkData)
      return res.status(403).render('error', {
        error: 'Uno o mas documentos no estan cargados en nuestro sistema, por favor actualice antes de continuar.',
      });

    return next();
  } catch (error) {
    return res.status(403).render('error', { error /* : 'Error de autorización..' */ });
  }
};

module.exports = { isUser, isAdmin, isLogged, redirectIfLoggedIn, isNotAdmin, isCartOwner, hasPrivileges, checkDocuments };
