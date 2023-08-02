// Deberia ser Services o DAO ??
const ProductModel = require('../model/schemas/products.schema');
class realTimeProdController {
  getRealTimeProd = async (req, res) => {
    try {
      const products = await ProductModel.find({});
      const simplifiedProduct = products.map((product) => {
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
      return res.render('realtimeproducts', { products: simplifiedProduct });
    } catch (error) {
      res.status(500).json({ status: 'error', msg: 'Error', payload: {} });
    }
  };
}

module.exports = new realTimeProdController();
