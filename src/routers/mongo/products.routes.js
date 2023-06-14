const express = require("express");
// const ProductManager = require("../../dao/fs/ProductManager");
// const data = new ProductManager("productsDB");

const MongoProducts = require("../../services/products.services")
const Services = new MongoProducts();

const productRoutes = express.Router();


productRoutes.get("/products", async (req, res) => {
  const limit = parseInt(req.query.limit);
  const response = await Services.getProductAll(limit);
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
