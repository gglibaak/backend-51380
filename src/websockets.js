const Products = require('./services/products.services');
const productsServices = new Products();
const Messages = require('./services/messages.services');
const messagesServices = new Messages();

const { logger } = require('./utils/logger.config');

module.exports = (io) => {
  io.on('connection', (socket) => {
    logger.debug(`New Client Connection with ID: ${socket.id}`);

    socket.on('new-product', async (newProd) => {
      try {
        await productsServices.addProduct({ ...newProd });
        // Actualizando lista despues de agregar producto nuevo
        const productsList = await productsServices.getProductAll({}, true); // true para no limitar la cantidad de productos por el paginate

        io.emit('success', 'Producto agregado con exito');
        io.emit('products', productsList.result.payload);
      } catch (error) {
        console.log(error);
      }
    });
    socket.on('delete-product', async (delProd, role, email) => {
      try {
        //compara si el role es premium o admin
        if (role !== 'admin' && role !== 'premium') {
          socket.emit('error', 'No tienes permisos para eliminar productos');
          return;
        }

        //si el role es premium compara si el producto es del mismo mail
        if (role === 'premium' && role !== 'admin') {
          const findProd = await productsServices.getProductById(delProd);

          //si el mail no es el mismo que el del producto no lo elimina
          if (findProd.result.payload.owner !== email) {
            socket.emit('error', 'No tienes permisos para eliminar productos que no creaste');
            return;
          }
        }

        await productsServices.deleteProduct(delProd);

        // Actualizando lista despues de eliminar un producto nuevo
        const productsList = await productsServices.getProductAll({}, true); // true para no limitar la cantidad de productos por el paginate

        io.emit('success', 'Producto eliminado con exito');
        io.emit('products', productsList.result.payload);
      } catch (error) {
        console.log(error);
      }
    });
    // *Chat Section*
    // Listening and Sending
    socket.on('new-message', async (data) => {
      try {
        await messagesServices.addMessage(data);

        const allMsgs = await messagesServices.getAllMessages();

        io.emit('chat-message', allMsgs);
      } catch (error) {
        console.log(error);
      }
    });
  });
};
