const CartModel = require('../dao/mongo/models/carts.model');
const ProductModel = require('../dao/mongo/models/products.model');
const TicketModel = require('../dao/mongo/models/tickets.model');
const MongoCarts = require('../services/carts.services');
const Services = new MongoCarts();

const mongoose = require('mongoose');

class MongoTickets {

async purchaseCart(cartId, cartList, userMail, userCartId) {
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
            error: `🛑 Invalid cart ID.`,
          },
        };
      }

      if (cartId !== userCartId) {
        return {
          status: 400,
          result: {
            status: 'error',
            error: `🛑 The cart ID does not match the user's cart ID.`,
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
        await Services.deleteProduct(
          cartId,
          productsFiltered.map((product) => product._id)
        );
        // console.log('FLAG Productos comprados: ', productsFiltered);
        //Limpia carrito cuando se compra
        await Services.deleteCart(cartId);
      }
      // Agrega los productos no comprados al carrito
      if (productsNotPurchased.length > 0) {
        await Services.updateCart(cartId, productsNotPurchased);
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

module.exports = MongoTickets;