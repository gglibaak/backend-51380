const { UsersDAO } = require('../model/daos/app.daos');
const usersDAO = new UsersDAO();
const { generateTokens, decodeTokens } = require('../utils/jwt.tokens');
const { sendMailResetPassword } = require('../controllers/mail.controller');
const { isValidPassword, createHash } = require('../utils/bcrypt.config');

class UsersService {
  async sendMailResetPassword(email) {
    //Chequear si el email existe en la base de datos
    const userRecovery = await usersDAO.getBy({ email: email });

    // Si el usuario ya tiene un token activo, no se le envía otro salvo que haya expirado
    if (userRecovery.token != null) {
      const decodedToken = decodeTokens(userRecovery.token);
      const expiration = parseInt(process.env.ACCESS_TOKEN_EXPIRATION, 10);
      if (decodedToken)
        return {
          status: 200,
          hbpage: 'password-recovery',
          result: {
            error: `Ya se ha enviado un mail para recuperar su contraseña. Revise su casilla principal o en spam. Intente nuevamente en ${expiration} minutos.`,
          },
        };
    }

    if (userRecovery) {
      // req.logger.debug('El mail existe');
      //Generar un token
      const token = generateTokens(userRecovery.email);

      userRecovery.token = token;

      // req.logger.debug('Usuario previo', userRecovery);

      await usersDAO.update(userRecovery._id, userRecovery);

      // req.logger.debug('Usuario actualizado', userRecovery);

      //Manda un mail con el token
      await sendMailResetPassword(userRecovery, token);
    } else {
      // req.logger.debug('El mail no existe');
      return {
        status: 200,
        hbpage: 'password-recovery',
        result: { error: 'El mail ingresado no existe en nuestros registros.' },
      };
    }

    const expiration = parseInt(process.env.ACCESS_TOKEN_EXPIRATION, 10);

    return {
      status: 200,
      hbpage: 'info',
      result: {
        title: 'Recuperación de Contraseña',
        subtitle: '🚀 Mail enviado con éxito!',
        info: 'Se ha enviado un mail a su casilla de correo con un link para recuperar su contraseña.',
        info2: 'El link expira en',
        value: `${expiration} minutos.`,
      },
    };
  }

  async checkToken(token) {
    //buscar el token en la base de datos
    const user = await usersDAO.getBy({ token: token });

    const decodedToken = decodeTokens(token);

    if (user) {
      // req.logger.debug('El token es valido');

      //Chequea si el token expiró
      if (!decodedToken) {
        // req.logger.debug('El Token expiró');
        return {
          status: 200,
          hbpage: 'password-recovery',
          result: { error: 'El Token expiró. Por favor haga nuevamente el pedido.' },
        };
      }

      return {
        status: 200,
        hbpage: 'password-reset',
        result: {},
      };
    } else {
      // req.logger.debug('El token no es valido');
      return {
        status: 200,
        hbpage: 'error',
        result: { error: 'El token no es valido' },
      };
    }
  }

  async resetPassword(token, password) {
    const checkUserInfo = await usersDAO.getBy({ token: token });
    const isSamePassword = isValidPassword(password, checkUserInfo.password);

    if (isSamePassword) {
      return {
        status: 200,
        hbpage: 'password-reset',
        result: { error: 'La contraseña no puede ser igual a las que ya se usaron con anterioridad. Ingrese otra diferente.' },
      };
    } else {
      const newPassword = createHash(password);
      //Limpia el token y actualiza la contraseña
      await usersDAO.update(checkUserInfo._id, { password: newPassword, token: null });
    }
    return {
      status: 200,
      hbpage: 'info',
      result: {
        title: 'Recuperación de Contraseña',
        subtitle: '✔ La contraseña fué cambiada con éxito',
        info: 'Ya puede ingresar con su nueva contraseña.',
        button: 'Ingresar',
        link: '/auth/login',
      },
    };
  }
}

module.exports = UsersService;
