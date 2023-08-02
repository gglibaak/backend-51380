const ProductsSchema = require('../../schemas/products.schema');

class ProductsDAO {

    async getAll(filter = {}, options = {}) {
        try {
            const products = await ProductsSchema.paginate(filter,options)
            return products;
        } catch (error) {
            console.log(error);
        }
    }

    async getById(id) {
        try {
            const product = await ProductsSchema.findOne({ _id: id });
            return product;
        } catch (error) {
            console.log(error);
        }
    }

    async add({ product }) {
        console.log(product);
        try {
            const newProduct = await ProductsSchema.create(product);
            return newProduct;
        } catch (error) {
            console.log(error);
        }
    }

    

}

module.exports = ProductsDAO;