const express = require("express");
const ProductManager = require("../ProductManager");
const dataProd = new ProductManager("productsDB");

const hbsRoutes = express.Router();

hbsRoutes.get("/", async (req, res) => {
  try {
    const version = parseInt(req.query.v)
    const products = await dataProd.getProducts();
    return res.render(
        version === 2
         ? "home2"
         : "home"

        , { products: products });
  } catch (error) {
    res.status(500).json({ succes: "false", msg: "Error", payload: {} });
  }
});

module.exports = hbsRoutes;
