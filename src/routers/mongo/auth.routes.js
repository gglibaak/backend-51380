const express = require("express");

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
    req.session.isAdmin = foundUser.isAdmin;
    req.session.firstName = foundUser.firstName;
    req.session.lastName = foundUser.lastName;
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
  const { firstName, lastName, email, password } = req.body;

  if (!email || !password || !firstName || !lastName) {
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

  await UserModel.create({
    firstName,
    lastName,
    email,
    password: createHash(password),
    isAdmin: false,
  });
  req.session.email = email;
  req.session.isAdmin = false;
  req.session.firstName = firstName;
  req.session.lastName = lastName;

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
  return res.render("profile", {
    firstname: req.session.firstName,
    lastname: req.session.lastName,
    email: req.session.email,
    isadmin: req.session.isAdmin,
  });
});

module.exports = authRoutes;
