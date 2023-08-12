const envConfig = require('../../config/env.config');
const { logger } = require('../../utils/logger.config');

let MessagesDAO;
let CartsDAO;
let ProductsDAO;
let TicketsDAO;
let UsersDAO;

switch (envConfig.PERSISTENCE) {
  case 'MONGO':
    logger.info('🍕Persistance with MongoDB');

    MessagesDAO = require('./messages/messages.mongo.dao');
    CartsDAO = require('./carts/carts.mongo.dao');
    ProductsDAO = require('./products/products.mongo.dao');
    TicketsDAO = require('./tickets/tickets.mongo.dao');
    UsersDAO = require('./users/users.mongo.dao');
    break;

  case 'FILESYSTEM':
    console.log('🍕Persistance with FileSystem');

    MessagesDAO = require('./messages/messages.fs.dao');
    CartsDAO = require('./carts/carts.fs.dao');
    ProductsDAO = require('./products/products.fs.dao');
    TicketsDAO = require('./tickets/tickets.fs.dao');
    UsersDAO = require('./users/users.fs.dao');
    break;

  case 'MEMORY':
    logger.info('🍕Persistance with Memory');
    break;

  default:
    throw new Error('Invalid persistence type');
}

module.exports = { MessagesDAO, CartsDAO, ProductsDAO, TicketsDAO, UsersDAO };
