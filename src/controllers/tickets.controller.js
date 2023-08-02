/*
const MongoTickets = require('../services/tickets.services');
const Services = new MongoTickets();
const userDTO = require('../dao/DTO/user.dto');

class ticketsController {

purchaseCart = async (req, res) => {
    const id = req.params.cid;
    const cartList = req.body;
    const infoUser = new userDTO(req.session);
    const response = await Services.purchaseCart(id, cartList, infoUser.email, infoUser.cartID);
    return res.status(response.status).json(response.result);
  };

getTicketById = async (req, res) => {
    const id = req.params.cid;
    //TODO DTO DE salida?
    const response = await Services.getTicketById(id);
    return res.render('ticket', { ticket: response.result });
  }

}

module.exports = new ticketsController(); */
