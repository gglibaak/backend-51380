const mongoose = require('mongoose');
const CartModel = require('../dao/mongo/models/carts.model');
const ProductModel = require('../dao/mongo/models/products.model');
const TicketModel = require('../dao/mongo/models/tickets.model');

class MongoCarts {
  async getCartsAll() {
    try {
      const carts = await CartModel.find({});
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

      const cartFiltered = await CartModel.findOne({ _id: id }).lean();

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
        const newCart = await CartModel.create({});
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

      const productFiltered = await ProductModel.findOne({ _id: prodId });
      const cartFiltered = await CartModel.findOne({ _id: cartId });

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

      const productFiltered = await ProductModel.findOne({ _id: prodId });
      const cartFiltered = await CartModel.findOne({ _id: cartId });

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

      const productFiltered = await ProductModel.findOne({ _id: prodId });
      const cartFiltered = await CartModel.findOne({ _id: cartId });

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

      const cartFiltered = await CartModel.findOne({ _id: cartId });

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

      const cartUpdated = await CartModel.findByIdAndUpdate(cartId, { products }, { new: true });

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

  async purchaseCart(cartId, cartList, userMail) {
    try {
      if (!Array.isArray(cartList)) {
        return {
          status: 400,
          result: {
            status: 'error',
            error: '🛑 The cart list must be a valid array.',
          },
        };
      }

      if (!cartList || cartList.length === 0) {
        return {
          status: 400,
          result: {
            status: 'error',
            error: `🛑 Cart list is empty.`,
          },
        };
      }

      if (!mongoose.Types.ObjectId.isValid(cartId)) {
        return {
          status: 400,
          result: {
            status: 'error',
            error: `🛑 Invalid card ID.`,
          },
        };
      }

      const cartFiltered = await CartModel.findOne({ _id: cartId });

      if (!cartFiltered) {
        return {
          status: 400,
          result: {
            status: 'error',
            error: `🛑 Cart not found.`,
          },
        };
      }

      const productsNotPurchased = [];

      const products = await Promise.all(
        cartList.map(async (product) => {
          const productFiltered = await ProductModel.findOne({ _id: product.id });

          if (!productFiltered) {
            return {
              status: 400,
              result: {
                status: 'error',
                error: `🛑 Product not found.`,
              },
            };
          }

          if (productFiltered.stock >= product.quantity) {
            productFiltered.stock -= product.quantity;
            await productFiltered.save();
            return productFiltered;
          } else {
            productsNotPurchased.push(product); // Agrega el producto a la lista de productos no comprados
            return null;
          }
        })
      );

      // Filtra los productos que no se compraron
      const productsFiltered = products.filter((product) => product !== null);

      // console.log('FLAG: Products filtered: ', productsFiltered);

      if (productsFiltered.length === 0) {
        return {
          status: 400,
          result: {
            status: 'error',
            error: `🛑 No products available.`,
          },
        };
      }

      // Calcula el total de la compra
      const totalAmount = cartList.reduce((acc, product) => {
        const productFiltered = productsFiltered.find((p) => p._id.equals(product.id));
        if (productFiltered) {
          acc += productFiltered.price * product.quantity;
        }
        return acc;
      }, 0);

      // console.log('FLAG Total amount: ', totalAmount);

      // Crea la orden
      const newOrder = {
        code: Math.floor(Math.random() * 1000000),
        purchase_datetime: new Date(),
        amount: +totalAmount,
        purchaser: userMail,
      };

      const orderCreated = await TicketModel.create(newOrder);

      // Borra los productos comprados del carrito
      if (productsFiltered.length > 0) {
        await this.deleteProduct(
          cartId,
          productsFiltered.map((product) => product._id)
        );
        // console.log('FLAG Productos comprados: ', productsFiltered);
        //Limpia carrito cuando se compra
        await this.deleteCart(cartId);
      }
      // Agrega los productos no comprados al carrito
      if (productsNotPurchased.length > 0) {
        await this.updateCart(cartId, productsNotPurchased);
        // console.log('FLAG Productos no comprados: ', productsNotPurchased);
      }

      return {
        status: 200,
        result: { status: 'success', payload: orderCreated },
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
