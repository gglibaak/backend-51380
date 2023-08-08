const EErros = require('../utils/errors/enums');

module.exports = (err, req, res, next) => {
  const error = err;
  const isJson = error.isJson;

  console.log(error.cause);

  // if (process.env.NODE_ENV === 'DEVELOPMENT') {
  //   console.log(error.stack);
  // }

  switch (error.code) {
    case EErros.PRODUCT_ALREADY_EXISTS:
    case EErros.INVALID_TYPES_ERROR:
      // console.log('Flag: LLEGA', isJson);
      isJson
        ? res.status(400).render('error', { error: err.name, cause: err.cause, error_code: err.code })
        : res.status(400).json({ status: 'error', error: err.name, cause: err.cause });
      break;
    case EErros.INVALID_REQUEST:
      break;

    default:
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
        payload: {},
      });
      break;
  }
};
