const env = require('../config/env.config');
const nodemailer = require('nodemailer');
const fetch = require('cross-fetch');
const { logger } = require('../utils/logger.config');

class mailController {
  getMail(req, res) {
    const captchaError = req.query.captcha_error === 'true';
    const envKey = env.RECAPTCHA_SITE_KEY;

    return res.status(200).render('mail', {
      email: req.session.email,
      captcha_error: captchaError,
      RECAPTCHA_SITE_KEY: envKey,
    });
  }

  async sendMail(req, res) {
    const { email, subject, message } = req.body;
    const recaptchaResponse = req.body['g-recaptcha-response'];
    const firstname = req.session.first_name;
    const lastname = req.session.last_name;

    // Verificar reCAPTCHA
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${env.RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`;

    try {
      const response = await fetch(verificationUrl, { method: 'POST' });
      const responseBody = await response.json();

      if (responseBody.success) {
        const subjectDefault = `💌 ${subject}` || 'Prueba de envio de email desde nodejs';

        const messageFiltered = `
            <div>
                <p>Hola, tienes un mensaje nuevo de <b>${firstname} ${lastname}</b>:</p>
                <p>${message}</p>

                <img src="https://i.gifer.com/3BMH.gif" />
            </div>
        `;

        const transport = nodemailer.createTransport({
          service: 'gmail',
          port: 587,
          auth: {
            user: env.GOOGLE_EMAIL,
            pass: env.GOOGLE_PASSWORD,
          },
        });

        const mailOptions = {
          from: env.GOOGLE_EMAIL,
          to: email,
          subject: subjectDefault,
          html: messageFiltered,
        };

        try {
          await transport.sendMail(mailOptions);
          res.status(200).render('info', {
            title: 'Envio de Mail',
            subtitle: '🚀 Mail enviado con éxito!',
            info: `Se ha enviado un mail a la casilla de correo ${email}`,
            button: 'Regresar',
            link: '/mail',
          });
        } catch (error) {
          res.status(500).render('error', { error: 'Error al enviar el correo electrónico' });
        }
      } else {
        res.redirect('/mail?captcha_error=true');
      }
    } catch (error) {
      res.status(500).render('error', { error: 'Error al verificar reCAPTCHA' });
    }
  }

  async sendMailResetPassword(userData, token) {
    const { email, first_name } = userData;

    try {
      const subject = `Recuperar Contreseña`;

      const messageFiltered = `
            <div>
                <p>Estimado ${first_name}, hemos recibido una solicitud de recuperación de contraseña. </p>
                <p>Para continuar con el proceso de recuperación de contraseña, por favor haga click en el siguiente enlace: </p>

                <a href="http://localhost:8080/auth/password-recovery/${token}">Recuperar Contraseña</a>
            </div>
        `;

      const transport = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
          user: env.GOOGLE_EMAIL,
          pass: env.GOOGLE_PASSWORD,
        },
      });

      const mailOptions = {
        from: env.GOOGLE_EMAIL,
        to: email,
        subject,
        html: messageFiltered,
      };

      // console.log(mailOptions);

      await transport.sendMail(mailOptions);
      logger.debug('Email de recuperación enviado');
    } catch (error) {
      logger.error(error);
    }
  }

  async sendMailInfo(user, subject, type = '') {
    const { email, first_name } = user;

    let html = {};

    // console.log(type);

    if (type === 'delete') {
      html = `<h1>Estimado ${first_name},</h1>
    <p>Le informamos que su cuenta ha sido eliminada por inactividad.</p>
    <p>Si desea volver a utilizar nuestros servicios, por favor, vuelva a registrarse.</p>
    <p>Saludos cordiales,</p>
    <p>Equipo de Soporte de Coder-Ecommerce</p>`;
    } else if (type === 'premium') {
      html = `<h1>Estimado ${first_name},</h1>
    <p>Le informamos que su producto ha sido eliminado por un Administrador.</p>
    <p>Ante cualquier duda o consulta no dude en contactarnos.</p>
    <p>Saludos cordiales,</p>
    <p>Equipo de Soporte de Coder-Ecommerce</p>`;
    }

    const mailOptions = {
      from: env.GOOGLE_EMAIL,
      to: email,
      subject,
      html,
    };

    const transport = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      auth: {
        user: env.GOOGLE_EMAIL,
        pass: env.GOOGLE_PASSWORD,
      },
    });

    try {
      await transport.sendMail(mailOptions);
    } catch (error) {
      console.log('Error al enviar el mail', error);
    }
  }
}

module.exports = new mailController();
