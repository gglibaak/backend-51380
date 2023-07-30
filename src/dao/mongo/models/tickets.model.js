const mongoose = require('mongoose');

const { Schema } = mongoose;
const ticketCollection = 'tickets';

const TicketSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    purchase_datetime: { type: Date, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true, default: 'Anonymous:API' },
  },
  { versionKey: false }
);

const TicketModel = mongoose.model(ticketCollection, TicketSchema);

module.exports = TicketModel;
