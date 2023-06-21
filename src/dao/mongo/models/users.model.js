const mongoose = require("mongoose");

const { Schema } = mongoose;
const userCollection = "users";

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
  },
  { versionKey: false }
);

const UserModel = mongoose.model(userCollection, UserSchema);

module.exports = UserModel;
