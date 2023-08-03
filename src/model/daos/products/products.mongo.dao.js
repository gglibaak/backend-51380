const ProductsSchema = require('../../schemas/products.schema');

class ProductsDAO {
  async getAll(filter = {}, options = {}) {
    try {
      const products = await ProductsSchema.paginate(filter, options);
      return products;
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id, checkid = false) {
    try {
      let product;
      checkid ? (product = await ProductsSchema.findOne({ code: id })) : (product = await ProductsSchema.findOne({ _id: id }));
      return product;
    } catch (error) {
      console.log(error);
    }
  }

  async add(product) {
    try {
      const newProduct = await ProductsSchema.create(product);
      return newProduct;
    } catch (error) {
      console.log(error);
    }
  }

  async update(id, product) {
    try {
      const productUpdated = await ProductsSchema.updateOne({ _id: id }, product);
      return productUpdated;
    } catch (error) {
      console.log(error);
    }
  }

  async delete(id) {
    try {
      const productDeleted = await ProductsSchema.deleteOne({ _id: id });
      return productDeleted;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ProductsDAO;
