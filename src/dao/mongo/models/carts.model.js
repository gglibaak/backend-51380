const mongoose = require("mongoose");

const { Schema } = mongoose;
const cartsCollection = "carts";

const CartSchema = new Schema(
  {
    products: [
      {
        id: {
          // type: Array,
          // default: [],
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

CartSchema.pre("find", function () {
  this.populate("products.id");
});

CartSchema.pre("findOne", function () {
  this.populate("products.id");
});

const CartModel = mongoose.model(cartsCollection, CartSchema);

module.exports = CartModel;
