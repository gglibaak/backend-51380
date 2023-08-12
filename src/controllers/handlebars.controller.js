const MongoProducts = require('../services/products.services');
const Services = new MongoProducts();

const CartProducts = require('../services/carts.services');
const CartServices = new CartProducts();

class handlebarsController {
  getHome = async (req, res) => {
    try {
      return res.render('home', {});
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
      const cartId = req.params.cid;
      const response = await CartServices.getCartsById(cartId);
      return res.render('carts', { cart: response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: 'error', msg: 'Error', payload: {} });
    }
  };

  getLoggertest = async (req, res) => {
    try {
      req.logger.debug('Este es un mensaje de depuración.');
      req.logger.http('Este es un mensaje HTTP.');
      req.logger.info('Este es un mensaje de información.');
      req.logger.warn('Este es un mensaje de advertencia.');
      req.logger.error('Este es un mensaje de error.');
      req.logger.fatal('Este es un mensaje fatal. 🍕');

      return res.status(200).json({ status: 'success', msg: 'Esto es un test, mirar consola de node.' });
    } catch (error) {
      req.logger.error(error);
    }
  };
}

module.exports = new handlebarsController();
