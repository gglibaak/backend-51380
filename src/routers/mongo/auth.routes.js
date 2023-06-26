const express = require("express");
const passport = require("passport");
const MongoCarts = require("../../services/carts.services");
const Services = new MongoCarts();
const UserModel = require("../../dao/mongo/models/users.model");
const { isUser } = require("../../middlewares/auth");
const { createHash, isValidPassword } = require("../../utils/bcrypt.config");

const authRoutes = express.Router();

authRoutes.get("/login", (req, res) => {
  return res.render("login", {});
});

/* authRoutes.post("/login", async (req, res) => {
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
*/
authRoutes.get("/register", (req, res) => {
  return res.render("register", {});
});

authRoutes.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/auth/fail-register" }),
  async (req, res) => {
    req.session.email = req.user.email;
    req.session.role = req.user.role;
    req.session.first_name = req.user.first_name;
    req.session.last_name = req.user.last_name;
    req.session.age = req.user.age;
    req.session.cartID = req.user.cartID;

    return res.redirect("/products");
  }
);

/* authRoutes.post("/register", async (req, res) => {
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
}); */

authRoutes.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/auth/fail-register" }),
  async (req, res) => {
    const { first_name, last_name, email, age } = req.body;

    req.session.email = email;
    req.session.role = "user";
    req.session.first_name = first_name;
    req.session.last_name = last_name;
    req.session.age = age;
    req.session.cartID = req.user.cartID;

    return res.redirect("/products");
  }
);

authRoutes.get("/fail-register", (req, res) => {
  const { error } = req.flash();
  return res.status(400).render("error", { error });
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

authRoutes.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

authRoutes.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/auth/fail-register" }),
  (req, res) => {
    console.log(req.user);
    req.session.email = req.user.email;
    req.session.role = "user";
    req.session.first_name = req.user.first_name;
    req.session.last_name = req.user.last_name;
    req.session.age = req.user.age;
    req.session.cartID = req.user.cartID;
    return res.redirect("/products");
  }
);

module.exports = authRoutes;
