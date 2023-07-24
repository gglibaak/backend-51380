const MongoProducts = require('../services/products.services');
const Services = new MongoProducts();

const CartProducts = require('../services/carts.services');
const CartServices = new CartProducts();

class handlebarsController {
  getAllProducts = async (req, res) => {
    // será Home del sitio
    try {
      const response = await Services.getProductAll({});
      return res.render('home', { products: response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: 'error', msg: 'Error', payload: {} });
    }
  };

  getProducts = async (req, res) => {
    try {
      const queryParams = req.query;
      const response = await Services.getProductAll(queryParams);
      const modifiedNextLink = response.result.nextLink?.substring(4) || '';
      const modifiedPrevLink = response.result.prevLink?.substring(4) || '';

      const role = req.session.role === 'admin' ? true : false;

      return res.render('products', {
        products: response,
        nextLink: modifiedNextLink,
        prevLink: modifiedPrevLink,
        email: req.session.email,
        isadmin: role,
        name: req.session.first_name,
        cartid: req.session.cartID,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: 'error', msg: 'Error', payload: {} });
    }
  };

  getCart = async (req, res) => {
    try {
      const cartId = req.params.cartId;
      const response = await CartServices.getCartsById(cartId);
      return res.render('carts', { cart: response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: 'error', msg: 'Error', payload: {} });
    }
  };
}

module.exports = new handlebarsController();
