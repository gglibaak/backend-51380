const express = require("express");
const chatRoutes = express.Router();
const MongoChat = require("../../services/chat.services");
const Services = new MongoChat();

chatRoutes.get("/", async (req, res) => {
  try {
    const messages = await Services.getAllMessages();

    return res.render("chat", { messages: messages });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, msg: "Internal Server Error", payload: {} });
  }
});

module.exports = chatRoutes;
