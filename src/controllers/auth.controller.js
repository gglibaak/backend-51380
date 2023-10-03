const UserServices = require('../services/users.services');
const Services = new UserServices();

class authController {
  getLogin = (req, res) => {
    return res.render('login', {});
  };

  getRegister = (req, res) => {
    return res.render('register', {});
  };

  passportLogin = async (req, res) => {
    req.session.email = req.user.email;
    req.session.role = req.user.role;
    req.session.first_name = req.user.first_name;
    req.session.last_name = req.user.last_name;
    req.session.age = req.user.age;
    req.session.cartID = req.user.cartID;
    req.session.orders = req.user.orders;
    req.session._id = req.user._id;

    return res.redirect('/products');
  };

  passportRegister = async (req, res) => {
    const { first_name, last_name, email, age } = req.body;

    req.session.email = email;
    req.session.role = 'user';
    req.session.first_name = first_name;
    req.session.last_name = last_name;
    req.session.age = age;
    req.session.cartID = req.user.cartID;
    req.session.orders = req.user.orders;
    return res.redirect('/products');
  };

  failRegister = (req, res) => {
    const { error } = req.flash();
    return res.status(400).render('error', { error });
  };

  logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.json({ status: 'error', body: err });
      }
    });
    return res.redirect('/auth/login');
  };

  getProfile = async (req, res) => {
    const role =
      req.session.role === 'admin' ? 'Administrador' : req.session.role === 'premium' ? '📯 Usuario Premium' : 'Usuario Estándar';
    return res.render('profile', {
      userId: req.session._id,
      firstname: req.session.first_name,
      lastname: req.session.last_name,
      email: req.session.email,
      isadmin: role,
      age: req.session.age,
      cartid: req.session.cartID,
      orders: req.session.orders,
    });
  };

  githubCallback = (req, res) => {
    req.session.email = req.user.email;
    req.session.role = req.user.role;
    req.session.first_name = req.user.first_name;
    req.session.last_name = req.user.last_name;
    req.session.age = req.user.age;
    req.session.cartID = req.user.cartID;
    req.session.orders = req.user.orders;
    req.session._id = req.user._id;
    return res.redirect('/products');
  };

  facebookCallback = (req, res) => {
    req.session.email = req.user.email;
    req.session.role = req.user.role;
    req.session.first_name = req.user.first_name;
    req.session.last_name = req.user.last_name;
    req.session.age = req.user.age;
    req.session.cartID = req.user.cartID;
    req.session.orders = req.user.orders;
    return res.redirect('/products');
  };

  googleCallback = (req, res) => {
    req.session.email = req.user.email;
    req.session.role = req.user.role;
    req.session.first_name = req.user.first_name;
    req.session.last_name = req.user.last_name;
    req.session.age = req.user.age;
    req.session.cartID = req.user.cartID;
    req.session.orders = req.user.orders;
    return res.redirect('/products');
  };
  getPasswordRecovery = (req, res) => {
    return res.render('password-recovery', {});
  };

  postPasswordRecovery = async (req, res) => {
    const { email } = req.body;
    const response = await Services.sendMailResetPassword(email);
    return res.status(response.status).render(response.hbpage, response.result);
  };

  getPasswordReset = async (req, res) => {
    const { token } = req.params;
    const response = await Services.checkToken(token);
    return res.status(response.status).render(response.hbpage, response.result);
  };

  postPasswordReset = async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const response = await Services.resetPassword(token, password);
    return res.status(response.status).render(response.hbpage, response.result);
  };
}

module.exports = new authController();
