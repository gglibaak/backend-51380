const env = require('../config/env.config');
const nodemailer = require('nodemailer');
const fetch = require('cross-fetch');

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
          res.status(200).json({ email_success: req.body }); //TODO cambiar a render de vista de exito
        } catch (error) {
  
          res.status(500).render('error', { error: 'Error al enviar el correo electrónico' });
        }
      } else {
        res.redirect('/mail?captcha_error=true');
      }
    } catch (error) {
    
      res.status(500).render("error", {error: 'Error al verificar reCAPTCHA' });
      
    }
  }
}

module.exports = new mailController();
