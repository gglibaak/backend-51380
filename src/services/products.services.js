const ProductModel = require("../dao/mongo/models/products.model");

class MongoProducts {
  async getProductAll(limitData) {
    try {
      const products = await ProductModel.find({}).limit(limitData);
      return { status: 200, result: { succes: true, payload: products } };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { succes: false, msg: "Internal Server Error", payload: {} },
      };
    }
  }

  async getProductById(id) {
    try {
      const productFiltered = await ProductModel.findOne({ _id: id });
      return {
        status: 200,
        result: { succes: true, payload: productFiltered },
      };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { succes: false, msg: "Internal Server Error", payload: {} },
      };
    }
  }

  async addProduct(data) {
    try {
      const { title, description, price, thumbnails, code, stock, category } =
        data;

      if (
        !title ||
        !description ||
        !price ||
        !thumbnails ||
        !code ||
        !stock ||
        !category
      ) {
        return {
          status: 400,
          result: { succes: false, error: `🛑 Wrong Data Format.` },
        };
      }

      if (await ProductModel.findOne({ code })) {
        return {
          status: 400,
          result: {
            succes: false,
            error: `🛑 The product alredy exists.`,
          },
        };
      }

      await ProductModel.create({
        title,
        description,
        price,
        thumbnails,
        code,
        stock,
        category,
        status: true,
      });
      return { status: 200, result: { succes: true, payload: data } };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { succes: false, msg: "Internal Server Error", payload: {} },
      };
    }
  }

  async updateProduct(id, newDataProduct) {
    try {
        const { title, description, price, thumbnails, code, stock, category } =
        newDataProduct;

      if (
        !title ||
        !description ||
        !price ||
        !thumbnails ||
        !code ||
        !stock ||
        !category
      ) {
        return {
          status: 400,
          result: { succes: false, error: `🛑 Wrong Data Format.` },
        };
      }

      
      if (!await ProductModel.findOne({ _id: id })) {
        return {
          status: 400,
          result: {
            succes: false,
            error: `🛑 Product not found.`,
          },
        };
      }

      const response = await ProductModel.updateOne(
        { _id: id },
        { title, description, price, thumbnails, code, stock, category }
      )

      return { status: 200, result: { succes: true, payload: response } };
        
    } catch (err) {
        console.log(err);
        return {
          status: 500,
          result: { succes: false, msg: "Internal Server Error", payload: {} },
        };
      }

  }

  async deleteProduct(id) {
    try {
      if (!await ProductModel.findOne({ _id: id })) {
        return {
          status: 400,
          result: {
            succes: false,
            error: `🛑 Invalid request. Product not found whit id: ${id}.`,
          },
        };
      }

      const response = await ProductModel.deleteOne({ _id: id });

      return { status: 200, result: { succes: true, payload: response } };
      
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { succes: false, msg: "Internal Server Error", payload: {} },
      };
    }
  }

}

module.exports = MongoProducts;
