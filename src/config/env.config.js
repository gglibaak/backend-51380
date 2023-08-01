const dotenv = require('dotenv');
const { Command } = require('commander');

const program = new Command();
program.option('--mode <mode>', 'Development mode', 'DEVELOPMENT');
program.parse();

dotenv.config({
  path: program.opts().mode === 'DEVELOPMENT' ? './.env.development' : './.env.production',
});

module.exports = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GOOGLE_EMAIL: process.env.GOOGLE_EMAIL,
  GOOGLE_PASSWORD: process.env.GOOGLE_PASSWORD,
  RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
};
