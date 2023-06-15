const express = require("express");

const MongoCarts = require("../../services/carts.services");
const Services = new MongoCarts();

const cartRoutes = express.Router();

cartRoutes.get("/carts", async (req, res) => {
  const response = await Services.getCartsAll();
  return res.status(response.status).json(response.result);
});

cartRoutes.get("/carts/:cid", async (req, res) => {
  const filteredId = req.params.cid;
  const response = await Services.getCartsById(filteredId);
  return res.status(response.status).json(response.result);
});

cartRoutes.post("/carts", async (req, res) => {
  response = await Services.addCart();
  return res.status(response.status).json(response.result);
});

cartRoutes.post("/carts/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const prodId = req.params.pid;
  response = await Services.addCart(cartId, prodId);
  return res.status(response.status).json(response.result);
});

module.exports = cartRoutes;
