const express = require("express");
const ProductModel = require("../../dao/mongo/models/products.model");
const { isAdmin } = require("../../middlewares/auth");

const realTimeProdRoutes = express.Router();

realTimeProdRoutes.get("/", isAdmin, async (req, res) => {
  try {
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
    return res.render("realtimeproducts", { products: simplifiedProduct });
  } catch (error) {
    res.status(500).json({ status: "error", msg: "Error", payload: {} });
  }
});

module.exports = realTimeProdRoutes;
