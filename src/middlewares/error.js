// importacion de los enums.js
const EErros = require('../utils/errors/enums');
const customErrorMsg = require('../utils/errors/customErrorMsg');

module.exports = (err, req, res, next) => {
  console.log(err);
  const error = err;
  const status = error.status || 500;
  const message = error.message || 'Internal server error';
  const stack = error.stack || 'No stack trace available';
  const cause = error.cause || 'No cause available';
  const name = error.name || 'No name available';

  if (process.env.NODE_ENV === 'development') {
    console.log(stack);
  }

  switch (error.code) {
    case EErros.INVALID_REQUEST:
      res.status(status).json({
        message,
        status,
      });
      break;

    case EErros.RECAPTCHA_ERROR:
      res.status(status).render('error', {
        name,
        error: message,
        cause: customErrorMsg.generateMailErrorInfo(name),
        error_code: EErros.RECAPTCHA_ERROR,
      });
      break;

    default:
      res.status(500).json({
        message,
        status: 'error',
      });
      break;
  }
};
