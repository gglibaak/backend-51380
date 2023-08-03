const mongoose = require('mongoose');

const ProductModel = require('../model/schemas/products.schema');
const { CartsDAO, ProductsDAO } = require('../model/daos/app.daos');

const cartsDAO = new CartsDAO();
const productDAO = new ProductsDAO();

class MongoCarts {
  async getCartsAll() {
    try {
      const carts = await cartsDAO.getAll();
      return { status: 200, result: { status: 'success', payload: carts } };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { status: 'error', msg: 'Internal Server Error', payload: {} },
      };
    }
  }

  async getCartsById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return {
          status: 400,
          result: {
            status: 'error',
            error: `🛑 Invalid cart ID.`,
          },
        };
      }

      const cartFiltered = await cartsDAO.getById(id, true); // plain = true -> return objeto plano

      return {
        status: 200,
        result: { status: 'success', payload: cartFiltered },
      };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { status: 'error', msg: 'Internal Server Error', payload: {} },
      };
    }
  }

  async addCart(cartId, prodId) {
    try {
      if (cartId === undefined || prodId === undefined) {
        const newCart = await cartsDAO.add({});
        return { status: 200, result: { status: 'success', payload: newCart } };
      } else {
        if (!mongoose.Types.ObjectId.isValid(prodId) || !mongoose.Types.ObjectId.isValid(cartId)) {
          return {
            status: 400,
            result: {
              status: 'error',
              error: `🛑 Invalid product or card ID.`,
            },
          };
        }
      }

      const productFiltered = await productDAO.getById(prodId);
      const cartFiltered = await cartsDAO.getById(cartId);

      if (!productFiltered || !cartFiltered) {
        return {
          status: 400,
          result: {
            status: 'error',
            error: `🛑 Product or Cart not found.`,
          },
        };
      }

      const productIndex = cartFiltered.products.findIndex((p) => p.id.equals(prodId));

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
        result: { status: 'error', msg: 'Internal Server Error', payload: {} },
      };
    }
  }

  async deleteProduct(cartId, prodId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(prodId) || !mongoose.Types.ObjectId.isValid(cartId)) {
        return {
          status: 400,
          result: {
            status: 'error',
            error: `🛑 Invalid product or card ID.`,
          },
        };
      }

      const productFiltered = await productDAO.getById(prodId);
      const cartFiltered = await cartsDAO.getById(cartId);

      if (!productFiltered || !cartFiltered) {
        return {
          status: 400,
          result: {
            status: 'error',
            error: `🛑 Product or Cart not found.`,
          },
        };
      }

      const productIndex = cartFiltered.products.findIndex((p) => p.id.equals(prodId));

      if (productIndex !== -1) {
        cartFiltered.products[productIndex].quantity -= 1;
        if (cartFiltered.products[productIndex].quantity === 0) {
          cartFiltered.products.splice(productIndex, 1);
        }
      } else {
        return {
          status: 400,
          result: {
            status: 'error',
            error: `🛑 Product not found in cart.`,
          },
        };
      }

      await cartFiltered.save();

      return {
        status: 200,
        result: { status: 'success', payload: cartFiltered },
      };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { status: 'error', msg: 'Internal Server Error', payload: {} },
      };
    }
  }

  async updateCartQty(cartId, prodId, quantity) {
    try {
      if (!mongoose.Types.ObjectId.isValid(prodId) || !mongoose.Types.ObjectId.isValid(cartId)) {
        return {
          status: 400,
          result: {
            status: 'error',
            error: `🛑 Invalid product or card ID.`,
          },
        };
      }

      const productFiltered = await productDAO.getById(prodId);
      const cartFiltered = await cartsDAO.getById(cartId);

      if (!productFiltered || !cartFiltered) {
        return {
          status: 400,
          result: {
            status: 'error',
            error: `🛑 Product or Cart not found.`,
          },
        };
      }

      const productIndex = cartFiltered.products.findIndex((p) => p.id.equals(prodId));

      if (productIndex !== -1) {
        cartFiltered.products[productIndex].quantity = quantity;
      } else {
        return {
          status: 400,
          result: {
            status: 'error',
            error: `🛑 Product not found in cart.`,
          },
        };
      }

      await cartFiltered.save();

      return {
        status: 200,
        result: { status: 'success', payload: cartFiltered },
      };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { status: 'error', msg: 'Internal Server Error', payload: {} },
      };
    }
  }

  async deleteCart(cartId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(cartId)) {
        return {
          status: 400,
          result: {
            status: 'error',
            error: `🛑 Invalid card ID.`,
          },
        };
      }

      const cartFiltered = await cartsDAO.getById(cartId);

      if (!cartFiltered) {
        return {
          status: 400,
          result: {
            status: 'error',
            error: `🛑 Cart not found.`,
          },
        };
      }

      cartFiltered.products = [];

      await cartFiltered.save();

      return {
        status: 200,
        result: { status: 'success', payload: cartFiltered },
      };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { status: 'error', msg: 'Internal Server Error', payload: {} },
      };
    }
  }

  async updateCart(cartId, products) {
    try {
      if (!mongoose.Types.ObjectId.isValid(cartId)) {
        return {
          status: 400,
          result: {
            status: 'error',
            error: `🛑 Invalid card ID.`,
          },
        };
      }

      const cartUpdated = await cartsDAO.update(cartId, { products });

      if (!cartUpdated) {
        return {
          status: 400,
          result: {
            status: 'error',
            error: `🛑 Cart not found.`,
          },
        };
      }

      return {
        status: 200,
        result: { status: 'success', payload: cartUpdated },
      };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { status: 'error', msg: 'Internal Server Error', payload: {} },
      };
    }
  }
}

module.exports = MongoCarts;
