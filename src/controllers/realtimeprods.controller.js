const Products = require('../services/products.services');
const productsServices = new Products();

class realTimeProdController {
  getRealTimeProd = async (req, res) => {
    try {
      const userEmail = req.session?.email;
      const userRole = req.session?.role;
      const productsList = await productsServices.getProductAll({}, true); // true para no limitar la cantidad de productos por el paginate

      return res.render('create-products', { products: productsList.result.payload, userEmail, userRole });
    } catch (error) {
      res.status(500).json({ status: 'error', msg: 'Error', payload: {} });
    }
  };
}

module.exports = new realTimeProdController();
