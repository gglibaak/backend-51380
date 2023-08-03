const MongoProducts = require('./services/products.services');
const Services = new MongoProducts();
const MongoChat = require('./services/messages.services');
const ChatServices = new MongoChat();

const { ProductsDAO } = require('./model/daos/app.daos');

const productDAO = new ProductsDAO();

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`New Client Connection with ID: ${socket.id}`);

    socket.on('new-product', async (newProd) => {
      try {
        await Services.addProduct({ ...newProd });
        // Actualizando lista despues de agregar producto nuevo
        const productsList = await productDAO.getAll({});

        const simplifiedProduct = productsList.map((product) => {
          return {
            title: product.title,
            id: product._id,
            description: product.description,
            price: product.price,
            code: product.code,
            stock: product.stock,
            category: product.category,
            thumbnails: product.thumbnails,
          };
        });

        io.emit('products', simplifiedProduct);
      } catch (error) {
        console.log(error);
      }
    });
    socket.on('delete-product', async (delProd) => {
      try {
        await Services.deleteProduct(delProd);

        // Actualizando lista despues de agregar producto nuevo
        const productsList = await productDAO.getAll({});
        const simplifiedProduct = productsList.map((product) => {
          return {
            title: product.title,
            id: product._id,
            description: product.description,
            price: product.price,
            code: product.code,
            stock: product.stock,
            category: product.category,
            thumbnails: product.thumbnails,
          };
        });

        io.emit('products', simplifiedProduct);
      } catch (error) {
        console.log(error);
      }
    });
    // *Chat Section*
    // Listening and Sending
    socket.on('new-message', async (data) => {
      try {
        newMessage = await ChatServices.addMessage(data);

        const allMsgs = await ChatServices.getAllMessages();

        io.emit('chat-message', allMsgs);
      } catch (error) {
        console.log(error);
      }
    });
  });
};
