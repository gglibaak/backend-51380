const mongoose = require("mongoose");
const CartModel = require("../dao/mongo/models/carts.model");
const ProductModel = require("../dao/mongo/models/products.model");

class MongoCarts {
  async getCartsAll() {
    try {
      const carts = await CartModel.find({});
      return { status: 200, result: { succes: true, payload: carts } };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { succes: false, msg: "Internal Server Error", payload: {} },
      };
    }
  }

  async getCartsById(id) {
    try {
      const cartFiltered = await CartModel.findOne({ _id: id });
      return {
        status: 200,
        result: { succes: true, payload: cartFiltered },
      };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { succes: false, msg: "Internal Server Error", payload: {} },
      };
    }
  }

  async addCart(cartId, prodId) {
    try {
      if (cartId === undefined || prodId === undefined) {
        const newCart = await CartModel.create({});
        return { status: 200, result: { succes: true, payload: newCart } };
      }

      const productFiltered = await ProductModel.findOne({ _id: prodId });
      const cartFiltered = await CartModel.findOne({ _id: cartId });

      if (
        !mongoose.Types.ObjectId.isValid(prodId) ||
        !mongoose.Types.ObjectId.isValid(cartId)
      ) {
        return {
          status: 400,
          result: {
            success: false,
            error: `🛑 Invalid product or card ID.`,
          },
        };
      }

      if (!productFiltered || !cartFiltered) {
        return {
          status: 400,
          result: {
            succes: false,
            error: `🛑 Product or Cart not found.`,
          },
        };
      }

      const productIndex = cartFiltered.products.findIndex((p) =>
        p.id.equals(prodId)
      );

      if (productIndex !== -1) {
        cartFiltered.products[productIndex].quantity += 1;
      } else {
        cartFiltered.products.push({ id: prodId, quantity: 1 });
      }

      await cartFiltered.save();

      return {
        status: 200,
        result: { succes: true, payload: cartFiltered },
      };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { succes: false, msg: "Internal Server Error", payload: {} },
      };
    }
  }
}

module.exports = MongoCarts;
