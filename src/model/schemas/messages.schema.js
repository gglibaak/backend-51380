const mongoose = require('mongoose');

const { Schema } = mongoose;
const messagesCollection = 'messages';

const MessageSchema = new Schema(
  {
    user: { type: String, required: true },
    message: { type: String, required: true },
  },
  { versionKey: false }
);

const MessageModel = mongoose.model(messagesCollection, MessageSchema);

module.exports = MessageModel;
