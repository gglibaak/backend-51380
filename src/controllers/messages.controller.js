const MongoChat = require('../services/messages.services');
const Services = new MongoChat();

class chatController {
  getAllMessages = async (req, res) => {
    try {
      const messages = await Services.getAllMessages();
      return res.render('chat', { messages: messages });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, msg: 'Internal Server Error', payload: {} });
    }
  };
}

module.exports = new chatController();
