const MongoCarts = require('../services/carts.services');
const Services = new MongoCarts();

const UserServices = require('../services/users.services');
const userService = new UserServices();

const MongoTickets = require('../services/tickets.services');
const ticketsServices = new MongoTickets();
const userDTO = require('../model/DTO/user.dto');

class cartsController {
  getCartAll = async (req, res) => {
    const response = await Services.getCartsAll();
    return res.status(response.status).json(response.result);
  };

  getCartById = async (req, res) => {
    const filteredId = req.params.cid;
    const response = await Services.getCartsById(filteredId);
    return res.status(response.status).json(response.result);
  };

  addCart = async (req, res) => {
    const response = await Services.addCart();
    return res.status(response.status).json(response.result);
  };

  addProduct = async (req, res) => {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const userEmail = req.session?.email;
    const userRole = req.session?.role;
    const response = await Services.addCart(cartId, prodId, userEmail, userRole);
    return res.status(response.status).json(response.result);
  };

  deleteProduct = async (req, res) => {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const userEmail = req.session?.email;
    const userRole = req.session?.role;
    response = await Services.deleteProduct(cartId, prodId, userEmail, userRole);
    return res.status(response.status).json(response.result);
  };

  updateCartQty = async (req, res) => {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const quantity = req.body.quantity;
    const response = await Services.updateCartQty(cartId, prodId, quantity);
    return res.status(response.status).json(response.result);
  };

  deleteCart = async (req, res) => {
    const id = req.params.cid;
    const response = await Services.deleteCart(id);
    return res.status(response.status).json(response.result);
  };

  updateCart = async (req, res) => {
    const id = req.params.cid;
    const infoUpdateCart = req.body;
    const response = await Services.updateCart(id, infoUpdateCart.products);
    return res.status(response.status).json(response.result);
  };

  purchaseCart = async (req, res) => {
    const id = req.params.cid;
    const cartList = req.body;
    const infoUser = new userDTO(req.session);
    const response = await ticketsServices.purchaseCart(id, cartList, infoUser.email, infoUser.cartID);
    return res.status(response.status).json(response.result);
  };

  getTicketById = async (req, res) => {
    const id = req.params.cid;
    // Actualizacion de ordenes al session
    const user = await userService.getProfile({ email: req.session.email });
    req.session.orders = user.result.payload.orders;
    const response = await ticketsServices.getTicketById(id);
    return res.render('ticket', { ticket: response.result });
  };
}
module.exports = new cartsController();
