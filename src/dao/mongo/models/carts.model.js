const mongoose = require("mongoose");

const { Schema } = mongoose;
const cartsCollection = "carts";

const CartSchema = new Schema(
  {
    products: [
      {
        id: {
          //Deberiamos seguir usando id o podria ser product por ej?
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
          default: 0,
        },
        _id: false,
      },
    ],
  },
  { versionKey: false }
);

const CartModel = mongoose.model(cartsCollection, CartSchema);

module.exports = CartModel;
