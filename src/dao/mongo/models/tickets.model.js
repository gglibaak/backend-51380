const mongoose = require('mongoose');

const { Schema } = mongoose;
const ticketCollection = 'tickets';

const TicketSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    purchase_datetime: { type: Date, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true, default: 'Anonymous:API' },
    products: [
      {
        id: { type: Schema.Types.ObjectId, ref: 'products' },
        quantity: { type: Number, required: true, default: 0 },
        _id: false,
      },
    ],

  },
  { versionKey: false }
);

TicketSchema.pre('find', function () {
  this.populate('products.id');
});

TicketSchema.pre('findOne', function () {
  this.populate('products.id');
});

const TicketModel = mongoose.model(ticketCollection, TicketSchema);

module.exports = TicketModel;
