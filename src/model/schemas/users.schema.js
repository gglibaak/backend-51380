const mongoose = require('mongoose');

const { Schema } = mongoose;
const userCollection = 'users';

const UserSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: false },
    password: { type: String, required: true },
    cartID: { type: String, required: false },
    role: { type: String, required: true, default: 'user' },
    token: { type: String, required: false },
  },
  { versionKey: false }
);

const UserModel = mongoose.model(userCollection, UserSchema);

module.exports = UserModel;
