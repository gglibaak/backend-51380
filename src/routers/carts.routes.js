const express = require("express");
const CartManager = require("../CartManager");
const dataCarts = new CartManager("cartDB");
const ProductManager = require("../ProductManager");
const dataProd = new ProductManager("productsDB");

const cartRoutes = express.Router();

cartRoutes.get("/carts", async (req, res) => {
  try {
    const carts = await dataCarts.getCarts();

    return res.status(200).json({ succes: true, payload: carts });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ succes: "false", msg: "Error", payload: {} });
  }
});

cartRoutes.post("/carts", async (req, res) => {
  try {
    await dataCarts.addCart({ products: [] });
    const cartData = await dataCarts.getCarts();

    return res
      .status(200)
      .json({ succes: true, payload: cartData[cartData.length - 1] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ succes: "false", msg: "Error", payload: {} });
  }
});

cartRoutes.get("/carts/:cid", async (req, res) => {
  try {
    const filteredId = parseInt(req.params.cid);
    const dataFiltered = await dataCarts.getCartById(filteredId);
    return res.status(200).json({ succes: true, payload: dataFiltered });
  } catch (err) {
    console.log(err);
    res.status(500).json({ succes: "false", msg: "Error", payload: {} });
  }
});

cartRoutes.post("/carts/:cid/products/:pid", async (req, res) => {
  try {
    const products = await dataProd.getProducts();
    const carts = await dataCarts.getCarts();
    const cartId = parseInt(req.params.cid);
    const prodId = parseInt(req.params.pid);

    let prodIndex = products.findIndex((p) => p.id === prodId);
    let cartIndex = carts.findIndex((p) => p.id === cartId);

    if (prodIndex === -1 || cartIndex === -1) {
      return res
        .status(400)
        .json({ succes: false, error: `🛑 Product or Cart not found.` });
    }

    const cartUpdate = await dataCarts.updateCart(cartId, prodId);
    return res.status(200).json({ succes: true, payload: cartUpdate });
  } catch (err) {
    console.log(err);
    res.status(500).json({ succes: "false", msg: "Error", payload: {} });
  }
});

module.exports = cartRoutes;
