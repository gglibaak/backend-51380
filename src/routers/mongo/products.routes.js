const express = require("express");

const MongoProducts = require("../../services/products.services");
const Services = new MongoProducts();

const productRoutes = express.Router();

productRoutes.get("/products", async (req, res) => {
  const queryParams = req.query;
  const response = await Services.getProductAll(queryParams);
  return res.status(response.status).json(response.result);
});

productRoutes.get("/products/:pid", async (req, res) => {
  const filteredId = req.params.pid;
  const response = await Services.getProductById(filteredId);
  return res.status(response.status).json(response.result);
});

productRoutes.post("/products", async (req, res) => {
  const newProduct = req.body;
  const response = await Services.addProduct(newProduct);
  return res.status(response.status).json(response.result);
});

productRoutes.put("/products/:pid", async (req, res) => {
  const id = req.params.pid;
  const infoUpdateProd = req.body;
  const response = await Services.updateProduct(id, infoUpdateProd);
  return res.status(response.status).json(response.result);
});

productRoutes.delete("/products/:pid", async (req, res) => {
  const id = req.params.pid;
  const response = await Services.deleteProduct(id);
  return res.status(response.status).json(response.result);
});

module.exports = productRoutes;
