const express = require("express");

const MongoCarts = require("../../services/carts.services");
const Services = new MongoCarts();
const UserModel = require("../../dao/mongo/models/users.model");
const { isUser } = require("../../middlewares/auth");
const { createHash, isValidPassword } = require("../../utils/bcrypt.config");

const authRoutes = express.Router();

authRoutes.get("/login", (req, res) => {
  return res.render("login", {});
});

authRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .render("error", { error: "Por favor indique su email y password." });
  }
  const foundUser = await UserModel.findOne({ email: email });
  if (foundUser && isValidPassword(password, foundUser.password)) {
    req.session.email = foundUser.email;
    req.session.role = foundUser.role;
    req.session.first_name = foundUser.first_name;
    req.session.last_name = foundUser.last_name;
    req.session.age = foundUser.age;
    req.session.cartID = foundUser.cartID;
  } else {
    return res.status(400).render("error", {
      error: "Por favor indique un email o password correcto.",
    });
  }
  return res.redirect("/products");
});

authRoutes.get("/register", (req, res) => {
  return res.render("register", {});
});

authRoutes.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body;

  if (!email || !password || !first_name || !last_name || !age) {
    return res
      .status(400)
      .render("error", { error: "Por favor indique sus datos correctamente." });
  }
  const userFinded = await UserModel.findOne({ email: email });
  if (userFinded) {
    return res
      .status(400)
      .render("error", { error: "El mail ya se encuentra en uso. " });
  }

  const newCart = await Services.addCart();
  const cartID = newCart.result.payload._id.toString();

  await UserModel.create({
    first_name,
    last_name,
    email,
    age,
    password: createHash(password),
    cartID,
    role: "user",
  });
  req.session.email = email;
  req.session.role = "user";
  req.session.first_name = first_name;
  req.session.last_name = last_name;
  req.session.age = age;
  req.session.cartID = cartID;

  return res.redirect("/products");
});

authRoutes.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.json({ status: "error", body: err });
    }
  });
  return res.redirect("/auth/login");
});

authRoutes.get("/profile", isUser, (req, res) => {
  const role =
    req.session.role === "admin" ? "Administrador" : "Usuario Estándar";
  return res.render("profile", {
    firstname: req.session.first_name,
    lastname: req.session.last_name,
    email: req.session.email,
    isadmin: role,
    age: req.session.age,
    cartid: req.session.cartID,
  });
});

module.exports = authRoutes;
