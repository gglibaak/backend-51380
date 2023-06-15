const { connect } = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGO_URL;

async function connectMongo() {
  try {
    await connect(uri);
    console.log("☁ Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw "Cannot connect to the database";
  }
}

module.exports = connectMongo;
