class CustomError {
  static createError({ name = 'Error', cause, message, code, isJson = false }) {
    const error = new Error(message, { cause });
    error.name = name;
    error.code = code;
    error.isJson = isJson;
    throw error;
  }
}

module.exports = CustomError;
