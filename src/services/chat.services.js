const { MessagesDAO } = require('../model/daos/app.daos');

const messagesDAO = new MessagesDAO();

class MongoChat {
  async getAllMessages() {
    try {
      const messages = await messagesDAO.getAll();
      const simplifiedMessages = messages.map((message) => {
        return {
          id: message._id,
          user: message.user,
          message: message.message,
        };
      });
      return simplifiedMessages;
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { succes: false, msg: 'Internal Server Error', payload: {} },
      };
    }
  }

  async addMessage(message) {
    try {
      const newMessage = await messagesDAO.add(message);
      return {
        status: 200,
        result: {
          success: true,
          msg: 'Message added successfully',
          payload: newMessage,
        },
      };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { success: false, msg: 'Internal Server Error', payload: {} },
      };
    }
  }
}

module.exports = MongoChat;
