const jwt = require('jsonwebtoken');
const env = require('../config/env.config');

const generateTokens = (email) => {
  try {
    const accessToken = jwt.sign({ email }, env.ACCESS_TOKEN_SECRET, {
      expiresIn: '5m',
    });
    // console.log(accessToken);
    return accessToken;
  } catch (error) {
    console.log(error);
  }
};

const decodeTokens = (token) => {
  try {
    const decodedToken = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
    console.log(decodedToken);
    return decodedToken;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { generateTokens, decodeTokens };
