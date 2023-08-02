const MessagesSchema = require('../../schemas/messages.schema');

class MessagesDAO {
  async getAll() {
    try {
      const menssages = await MessagesSchema.find({});
      return menssages;
    } catch (error) {
      console.log(error);
    }
  }

  async add(message) {
    try {
      const newMessage = await MessagesSchema.create(message);
      return newMessage;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = MessagesDAO;
