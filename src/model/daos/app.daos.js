const envConfig = require('../../config/env.config');

let MessagesDAO;
let CartsDAO;
let ProductsDAO;

switch (envConfig.PERSISTENCE) {
  case 'MONGO':
    console.log('🍕Persistance with MongoDB');
    MessagesDAO = require('./messages/messages.mongo.dao');
    CartsDAO = require('./carts/carts.mongo.dao');
    ProductsDAO = require('./products/products.mongo.dao');
    //TicketsDAO

    break;
  case 'FILESYSTEM':
    console.log('🍕Persistance with FileSystem');
    MessagesDAO = require('./messages/messages.fs.dao');
    CartsDAO = require('./carts/carts.fs.dao');
    break;
  case 'MEMORY':
    console.log('Persistance with Memory');
    break;
  default:
    throw new Error('Invalid persistence type');
}

module.exports = { MessagesDAO, CartsDAO, ProductsDAO };
