const ProductModel = require("../src/dao/mongo/models/products.model");
const MongoProducts = require("../src/services/products.services");
const Services = new MongoProducts();

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`New Client Connection with ID: ${socket.id}`);

    socket.on("new-product", async (newProd) => {
      try {
        await Services.addProduct({ ...newProd });
        // Actualizando lista despues de agregar producto nuevo
        const productsList = await ProductModel.find({});

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

        io.emit("products", simplifiedProduct);
      } catch (error) {
        console.log(error);
      }
    });
    socket.on("delete-product", async (delProd) => {
      try {
        await Services.deleteProduct(delProd);

        // Actualizando lista despues de agregar producto nuevo
        const productsList = await ProductModel.find({});
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

        io.emit("products", simplifiedProduct);
      } catch (error) {
        console.log(error);
      }
    });
  });
};
