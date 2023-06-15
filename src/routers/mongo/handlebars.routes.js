const express = require("express");
const ProductModel = require("../../dao/mongo/models/products.model");

const hbsRoutes = express.Router();

hbsRoutes.get("/", async (req, res) => {
  try {
    const version = parseInt(req.query.v);
    const products = await ProductModel.find({});

    const simplifiedProduct = products.map((product) => {
      return {
        title: product.title,
        id: product._id,
        description: product.description,
        price: product.price,
        code: product.code,
        stock: product.stock,
        category: product.category,
        thumbnails: product.thumbnails,
      };
    });
    return res.render(
      version === 2 ? "home2" : "home",

      { products: simplifiedProduct }
    );
  } catch (error) {
    res.status(500).json({ succes: "false", msg: "Error", payload: {} });
  }
});

module.exports = hbsRoutes;
