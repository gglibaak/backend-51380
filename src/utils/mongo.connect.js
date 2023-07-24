const { connect } = require('mongoose');
const env = require('../config/env.config');

const uri = env.MONGO_URL;

async function connectMongo() {
  try {
    await connect(uri);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw 'Cannot connect to the database';
  }
}

module.exports = connectMongo;
