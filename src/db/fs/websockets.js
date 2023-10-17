const ProductManager = require('./dao/fs/ProductManager');
const data = new ProductManager('productsDB');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`New Client Connection with ID: ${socket.id}`);

    socket.on('new-product', async (newProd) => {
      try {
        await data.addProduct({ ...newProd });
        // Actualizando lista despues de agregar producto nuevo
        const productsList = await data.getProducts();

        io.emit('products', productsList);
      } catch (error) {
        console.log(error);
      }
    });
    socket.on('delete-product', async (delProd) => {
      try {
        let id = parseInt(delProd);
        await data.deleteProduct(id);

        const productsList = await data.getProducts();

        io.emit('products', productsList);
      } catch (error) {
        console.log(error);
      }
    });
  });
};
