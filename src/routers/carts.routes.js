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

    if (prodIndex || cartIndex === -1) {
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

/*
  cartRoutes.get("/products/:pid", async (req, res) => {
    try {
      const filteredId = parseInt(req.params.pid);
      const dataFiltered = await data.getProductById(filteredId);

      return res.status(200).json( {succes: true, payload: dataFiltered});
    } catch (err) {
      console.log(err);
      res.status(500).json( {succes: "false", msg: "Error",payload: {}});
    }
  });

  cartRoutes.post("/products", async (req, res) => {
    try {
        const products = await data.getProducts();
        const newProduct = req.body;
        const { title, description, price, thumbnail, code, stock, category } = req.body;
        if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
            return res
            .status(400)
            .json({ succes: false, error: `🛑 Wrong Data Format.` });
        }

        const checkData = (products.find((ele) => ele.code === newProduct.code))

      //solo apto para la carga individual de productos ??? ver
      const getId = products.length+1

      checkData ? (res.status(400).json( { status: false, msg: `🛑 Invalid request. The product already exists(code: ${newProduct.code}).`}))
      : (await data.addProduct({ ...newProduct }), res.status(200).json( {succes: true, payload: { id:getId ,...newProduct}}))

    } catch (err) {
      console.log(err);
      res.status(500).json( {succes: "false", msg: "Error", payload: {}});
    }
  });

  cartRoutes.put("/products/:pid", async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const infoUpdateProd = req.body;
        const { title, description, price, thumbnail, code, stock, category } = req.body;
        if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
            return res
            .status(400)
            .json({ succes: false, error: `🛑 Wrong Data Format.` });
        }

        await data.updateProduct(id, infoUpdateProd);
        return res.status(200).json({ succes: true, payload: {infoUpdateProd}})

    } catch (err) {
        console.log(err);
        res.status(500).json( { succes: "false", msg: "Error", payload: {} });
    }
  });

  cartRoutes.delete("/products/:pid", async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const products = await data.getProducts();
        const checkData = products.find((ele) => ele.id == id);
        const productDeleted = await data.getProductById(id)

        !checkData ? (res.status(400).json( { status: false, msg: `🛑 Invalid request. Product not found(id: ${id}).`}))
      : (await data.deleteProduct(id), res.status(200).json( {succes: true, payload: { productDeleted }}))


    } catch (err) {
        console.log(err);
        res.status(500).json( { succes: "false", msg: "Error", payload: {} });
    }
  });
*/
module.exports = cartRoutes;
