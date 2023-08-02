const envConfig = require('../../config/env.config');

let MessagesDAO;
let CartsDAO;

switch (envConfig.PERSISTENCE) {
  case 'MONGO':
    console.log('🍕Persistance with MongoDB');
    MessagesDAO = require('./messages/messages.mongo.dao');
    CartsDAO = require('./carts/carts.mongo.dao');
    //UsersDAO
    //ProductsDAO
    //TicketsDAO

    break;
  case 'FILESYSTEM':
    console.log('Persistance with FileSystem');
    break;
  case 'MEMORY':
    console.log('Persistance with Memory');
    break;
  default:
    throw new Error('Invalid persistence type');
}

module.exports = { MessagesDAO, CartsDAO };
