const MongoCarts = require('../services/carts.services');
const Services = new MongoCarts();

const mongoose = require('mongoose');

const { TicketsDAO, ProductsDAO, CartsDAO } = require('../model/daos/app.daos');
const ticketsDAO = new TicketsDAO();
const productDAO = new ProductsDAO();
const cartsDAO = new CartsDAO();

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

      const productsNotPurchased = [];
      const productToPurchase = [];

      // console.log('Lista de compras:', cartList);

      const asyncOperations = cartList.map(async (CartProduct) => {
        const checkStock = await productDAO.getById(CartProduct.id);

        if (!checkStock) {
          productsNotPurchased.push(CartProduct);
        } else if (checkStock.stock >= CartProduct.quantity) {
          checkStock.stock -= CartProduct.quantity;
          await checkStock.save(); // Actualiza el stock del producto en la base de datos
          productToPurchase.push({
            product: checkStock,
            quantity: CartProduct.quantity, // Agregamos el quantity al objeto
          });
        } else {
          productsNotPurchased.push(CartProduct);
        }
      });

      await Promise.all(asyncOperations); // Espera a que todas las operaciones asincronicas terminen

      // console.log('FLAG: Products not purchased: ', productsNotPurchased);

      // Calcula el total de la compra
      const totalAmount = productToPurchase.reduce((acc, p) => {
        acc += p.product.price * p.quantity;
        return acc;
      }, 0);

      // console.log('FLAG: Total amount: ', totalAmount);

      // Formatea los productos que se pueden comprar para el ticket
      const productFormat = productToPurchase.map((p) => ({
        id: p.product._id.toString(),
        quantity: p.quantity,
      }));

      const newOrder = {
        code: Math.floor(Math.random() * 1000000),
        purchase_datetime: new Date(),
        amount: +totalAmount,
        purchaser: userMail,
        products: productFormat,
      };

      // console.log('FLAG: New order: ', newOrder);

      //Creacion de ticket en DB
      const orderCreated = await ticketsDAO.add(newOrder);

      //TODO Agregar el ticket al usuario (cuenta)

      //Chequea si el la orden se creo correctamente
      if (!orderCreated) {
        //Limpia carrito cuando se compra
        await Services.deleteCart(cartId);

        //Agrega los productos no comprados al carrito original
        if (productsNotPurchased.length > 0) {
          await Services.updateCart(userCartId, productsNotPurchased);
          // console.log('FLAG Productos no comprados: ', productsNotPurchased);
        }
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

  async getTicketById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return {
          status: 400,
          result: {
            status: 'error',
            error: `🛑 Invalid ticket ID.`,
          },
        };
      }

      const ticket = await ticketsDAO.getById(id);
      if (!ticket) {
        return {
          status: 404,
          result: {
            status: 'error',
            error: `🛑 Ticket not found.`,
          },
        };
      }

      return {
        status: 200,
        result: { status: 'success', payload: ticket },
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
