const express = require("express");
const ProductManager = require("../ProductManager");
const data = new ProductManager("productsDB");

const productRoutes = express.Router();

productRoutes.get("/products", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const products = await data.getProducts();
    const slicedProducts = limit ? products.slice(0, limit) : products;
    return res.status(200).json({ succes: true, payload: slicedProducts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ succes: "false", msg: "Error", payload: {} });
  }
});

productRoutes.get("/products/:pid", async (req, res) => {
  try {
    const filteredId = parseInt(req.params.pid);
    const dataFiltered = await data.getProductById(filteredId);

    return res.status(200).json({ succes: true, payload: dataFiltered });
  } catch (err) {
    console.log(err);
    res.status(500).json({ succes: "false", msg: "Error", payload: {} });
  }
});

productRoutes.post("/products", async (req, res) => {
  try {
    const products = await data.getProducts();
    const newProduct = req.body;
    const { title, description, price, thumbnail, code, stock, category } =
      req.body;
    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      !stock ||
      !category
    ) {
      return res
        .status(400)
        .json({ succes: false, error: `🛑 Wrong Data Format.` });
    }

    const checkData = products.find((ele) => ele.code === newProduct.code);

    //solo apto para la carga individual de productos
    const getId = products.length + 1;

    checkData
      ? res
          .status(400)
          .json({
            status: false,
            msg: `🛑 Invalid request. The product already exists(code: ${newProduct.code}).`,
          })
      : (await data.addProduct({ ...newProduct }),
        res
          .status(200)
          .json({ succes: true, payload: { id: getId, ...newProduct } }));
  } catch (err) {
    console.log(err);
    res.status(500).json({ succes: "false", msg: "Error", payload: {} });
  }
});

productRoutes.put("/products/:pid", async (req, res) => {
  try {
    const products = await data.getProducts();
    const id = parseInt(req.params.pid);
    const infoUpdateProd = req.body;
    const { title, description, price, thumbnail, code, stock, category } =
      req.body;
    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      !stock ||
      !category
    ) {
      return res
        .status(400)
        .json({ succes: false, error: `🛑 Wrong Data Format.` });
    }
    let prodIndex = products.findIndex((p) => p.id === id);

    if (prodIndex === -1) {
      return res
        .status(400)
        .json({ succes: false, error: `🛑 Product not found.` });
    }

    await data.updateProduct(id, infoUpdateProd);
    return res.status(200).json({ succes: true, payload: { infoUpdateProd } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ succes: "false", msg: "Error", payload: {} });
  }
});

productRoutes.delete("/products/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    const products = await data.getProducts();
    const checkData = products.find((ele) => ele.id == id);
    const productDeleted = await data.getProductById(id);

    !checkData
      ? res
          .status(400)
          .json({
            status: false,
            msg: `🛑 Invalid request. Product not found(id: ${id}).`,
          })
      : (await data.deleteProduct(id),
        res.status(200).json({ succes: true, payload: { productDeleted } }));
  } catch (err) {
    console.log(err);
    res.status(500).json({ succes: "false", msg: "Error", payload: {} });
  }
});

module.exports = productRoutes;
