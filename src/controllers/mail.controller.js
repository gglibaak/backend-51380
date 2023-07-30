const env = require('../config/env.config');
const nodemailer = require('nodemailer');

class mailController {
  getMail(req, res) {
    return res.status(200).render('mail', {
      email: req.session.email,
    });
  }

  async sendMail(req, res) {
    const { email, subject, message } = req.body;
    const firstname = req.session.first_name;
    const lastname = req.session.last_name;

    const subjectDefault = `💌 ${subject}` || 'Prueba de envio de email desde nodejs';

    const messageFiltered = `
        <div>
            <p>Hola, tienes un mensaje nuevo de <b>${firstname} ${lastname}</b>:</p>
            <p>${message}</p>

            <img src="https://i.gifer.com/3BMH.gif" />
        </div>
    `;

    // console.log('email', email);
    // console.log('message', message);

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
    await transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send({ email_failed: error.message });
      } else {
        // console.log('Email enviado');
        res.status(200).json({ email_success: req.body });
      }
    });
  }
}

module.exports = new mailController();
