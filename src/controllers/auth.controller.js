const { UsersDAO } = require('../model/daos/app.daos');
const usersDAO = new UsersDAO();
const { generateTokens, decodeTokens } = require('../utils/jwt.tokens');
const { sendMailResetPassword } = require('./mail.controller');
const { isValidPassword, createHash } = require('../utils/bcrypt.config');
//TODO USAR SERVICES PARA PODER USAR DAO, HACER SERVICES DE USERS

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

  getProfile = (req, res) => {
    const role = req.session.role === 'admin' ? 'Administrador' : 'Usuario Estándar';
    return res.render('profile', {
      firstname: req.session.first_name,
      lastname: req.session.last_name,
      email: req.session.email,
      isadmin: role,
      age: req.session.age,
      cartid: req.session.cartID,
    });
  };

  githubCallback = (req, res) => {
    req.session.email = req.user.email;
    req.session.role = req.user.role;
    req.session.first_name = req.user.first_name;
    req.session.last_name = req.user.last_name;
    req.session.age = req.user.age;
    req.session.cartID = req.user.cartID;
    return res.redirect('/products');
  };

  facebookCallback = (req, res) => {
    req.session.email = req.user.email;
    req.session.role = req.user.role;
    req.session.first_name = req.user.first_name;
    req.session.last_name = req.user.last_name;
    req.session.age = req.user.age;
    req.session.cartID = req.user.cartID;
    return res.redirect('/products');
  };

  googleCallback = (req, res) => {
    req.session.email = req.user.email;
    req.session.role = req.user.role;
    req.session.first_name = req.user.first_name;
    req.session.last_name = req.user.last_name;
    req.session.age = req.user.age;
    req.session.cartID = req.user.cartID;
    return res.redirect('/products');
  };
  getPasswordRecovery = (req, res) => {
    return res.render('password-recovery', {});
  };

  postPasswordRecovery = async (req, res) => {
    const { email } = req.body;
    // console.log(email);
    //Chequear si el email existe en la base de datos
    const userRecovery = await usersDAO.getBy({ email: email });

    if (userRecovery) {
      console.log('El mail existe');
      //Generar un token
      const token = generateTokens(userRecovery.email);

      userRecovery.token = token;

      console.log('Usuario previo', userRecovery);
      //TODO CREAR EN DAO el metodo update para actualizar el token
      await usersDAO.update(userRecovery._id, userRecovery);
      console.log('Usuario actualizado', userRecovery);

      //Manda un mail con el token
      await sendMailResetPassword(userRecovery, token);
    } else {
      console.log('El mail no existe');
      return res.render('password-recovery', { error: 'El mail ingresado no existe en nuestros registros.' });
    }

    //TODO render de vista de mail enviado con contador de tiempo para que se borre el token
    return res.status(200).json({ status: 'ok', body: 'Mail enviado' });
  };

  getPasswordReset = async (req, res) => {
    //Url de reseteo de password mas el token que se envió por mail
    //COMPRUEBA QUE EL TOKEN SEA VALIDO
    const { token } = req.params;
    //buscar el token en la base de datos
    const user = await usersDAO.getBy({ token: token });

    const decodedToken = decodeTokens(token);

    // console.log('Token decodificado', decodedToken);

    if (user) {
      console.log('El token es valido');

      //Chequea si el token expiró
      if (!decodedToken) {
        console.log('El Token expiró');
        return res.render('password-recovery', { error: 'El Token expiró. Por favor haga nuevamente el pedido.' });
      }

      return res.render('password-reset', {});
    } else {
      console.log('El token no es valido');
      return res.render('error', { error: 'El token no es valido' });
    }
  };

  postPasswordReset = async (req, res) => {
    //ACA SE CAMBIA LA CONTRASEÑA DEL USUARIO
    const { password } = req.body;
    const { token } = req.params;

    // console.log('desde el front', password);

    const checkUserInfo = await usersDAO.getBy({ token: token });

    const isSamePassword = isValidPassword(password, checkUserInfo.password);

    if (isSamePassword) {
      console.log('La contraseña es la misma');
      return res.render('password-reset', { error: 'La contraseña es la misma. Ingrese otra diferente.' });
    } else {
      const newPassword = await createHash(password);

      await usersDAO.update(checkUserInfo._id, { password: newPassword });
    }

    // return res.redirect('/auth/login'); //TODO SARASA
    console.log('La contraseña fué cambiada');
  };
}

module.exports = new authController();
