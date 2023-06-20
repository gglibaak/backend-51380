const mongoose = require("mongoose");
const CartModel = require("../dao/mongo/models/carts.model");
const ProductModel = require("../dao/mongo/models/products.model");

class MongoCarts {
  async getCartsAll() {
    try {
      const carts = await CartModel.find({});
      return { status: 200, result: { status: "success", payload: carts } };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { status: "error", msg: "Internal Server Error", payload: {} },
      };
    }
  }

  async getCartsById(id) {
    try {
      const cartFiltered = await CartModel.findOne({ _id: id });

      return {
        status: 200,
        result: { status: "success", payload: cartFiltered },
      };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { status: "error", msg: "Internal Server Error", payload: {} },
      };
    }
  }

  async addCart(cartId, prodId) {
    try {
      if (cartId === undefined || prodId === undefined) {
        const newCart = await CartModel.create({});
        return { status: 200, result: { status: "success", payload: newCart } };
      } else {
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
      }

      const productFiltered = await ProductModel.findOne({ _id: prodId });
      const cartFiltered = await CartModel.findOne({ _id: cartId });

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
        result: { status: "error", msg: "Internal Server Error", payload: {} },
      };
    }
  }

  async deleteProduct(cartId, prodId) {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(prodId) ||
        !mongoose.Types.ObjectId.isValid(cartId)
      ) {
        return {
          status: 400,
          result: {
            status: "error",
            error: `🛑 Invalid product or card ID.`,
          },
        };
      }

      const productFiltered = await ProductModel.findOne({ _id: prodId });
      const cartFiltered = await CartModel.findOne({ _id: cartId });

      if (!productFiltered || !cartFiltered) {
        return {
          status: 400,
          result: {
            status: "error",
            error: `🛑 Product or Cart not found.`,
          },
        };
      }

      const productIndex = cartFiltered.products.findIndex((p) =>
        p.id.equals(prodId)
      );

      if (productIndex !== -1) {
        cartFiltered.products[productIndex].quantity -= 1;
        if (cartFiltered.products[productIndex].quantity === 0) {
          cartFiltered.products.splice(productIndex, 1);
        }
      } else {
        return {
          status: 400,
          result: {
            status: "error",
            error: `🛑 Product not found in cart.`,
          },
        };
      }

      await cartFiltered.save();

      return {
        status: 200,
        result: { status: "success", payload: cartFiltered },
      };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { status: "error", msg: "Internal Server Error", payload: {} },
      };
    }
  }

  async updateCartQty(cartId, prodId, quantity) {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(prodId) ||
        !mongoose.Types.ObjectId.isValid(cartId)
      ) {
        return {
          status: 400,
          result: {
            status: "error",
            error: `🛑 Invalid product or card ID.`,
          },
        };
      }

      const productFiltered = await ProductModel.findOne({ _id: prodId });
      const cartFiltered = await CartModel.findOne({ _id: cartId });

      if (!productFiltered || !cartFiltered) {
        return {
          status: 400,
          result: {
            status: "error",
            error: `🛑 Product or Cart not found.`,
          },
        };
      }

      const productIndex = cartFiltered.products.findIndex((p) =>
        p.id.equals(prodId)
      );

      if (productIndex !== -1) {
        cartFiltered.products[productIndex].quantity = quantity;
      } else {
        return {
          status: 400,
          result: {
            status: "error",
            error: `🛑 Product not found in cart.`,
          },
        };
      }

      await cartFiltered.save();

      return {
        status: 200,
        result: { status: "success", payload: cartFiltered },
      };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { status: "error", msg: "Internal Server Error", payload: {} },
      };
    }
  }

  async deleteCart(cartId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(cartId)) {
        return {
          status: 400,
          result: {
            status: "error",
            error: `🛑 Invalid card ID.`,
          },
        };
      }

      const cartFiltered = await CartModel.findOne({ _id: cartId });

      if (!cartFiltered) {
        return {
          status: 400,
          result: {
            status: "error",
            error: `🛑 Cart not found.`,
          },
        };
      }

      cartFiltered.products = [];

      await cartFiltered.save();

      return {
        status: 200,
        result: { status: "success", payload: cartFiltered },
      };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { status: "error", msg: "Internal Server Error", payload: {} },
      };
    }
  }

  async updateCart(cartId, products) {
    try {
      if (!mongoose.Types.ObjectId.isValid(cartId)) {
        return {
          status: 400,
          result: {
            status: "error",
            error: `🛑 Invalid card ID.`,
          },
        };
      }

      const cartUpdated = await CartModel.findByIdAndUpdate(
        cartId,
        { products },
        { new: true }
      );

      if (!cartUpdated) {
        return {
          status: 400,
          result: {
            status: "error",
            error: `🛑 Cart not found.`,
          },
        };
      }

      return {
        status: 200,
        result: { status: "success", payload: cartUpdated },
      };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { status: "error", msg: "Internal Server Error", payload: {} },
      };
    }
  }
}

module.exports = MongoCarts;
