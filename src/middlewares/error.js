const EErros = require('../utils/errors/enums');

module.exports = (err, req, res, next) => {
  const error = err;
  const status = error.status || 500;
  const message = error.message || 'Internal server error';
  const stack = error.stack || 'No stack trace available';
  const cause = error.cause || 'No cause available';
  const isJson = error.isJson;

  if (process.env.NODE_ENV === 'DEVELOPMENT') {
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
      isJson
        ? res.status(status).json({
            error: message,
            cause,
            error_code: EErros.RECAPTCHA_ERROR,
          })
        : res.status(status).render('error', {
            error: message,
            cause,
            error_code: EErros.RECAPTCHA_ERROR,
          });
      if (process.env.NODE_ENV === 'DEVELOPMENT') {
        console.error(cause);
      }
      break;

    default:
      res.status(status).json({
        message,
        status: 'error',
      });
      break;
  }
};
