const jwt = require('jsonwebtoken');
const env = require('../config/env.config');
const { logger } = require('../utils/logger.config');

env.NODE_ENV === 'DEVELOPMENT' ? (expirationTime = '3m') : (expirationTime = '5m');

process.env.ACCESS_TOKEN_EXPIRATION = expirationTime;

const generateTokens = (email) => {
  try {
    const accessToken = jwt.sign({ email }, env.ACCESS_TOKEN_SECRET, {
      expiresIn: expirationTime,
    });
    return accessToken;
  } catch (error) {
    logger.error(error, error.message);
  }
};

const decodeTokens = (token) => {
  try {
    const decodedToken = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
    return decodedToken;
  } catch (error) {
    logger.error(error);
  }
};

module.exports = { generateTokens, decodeTokens };
