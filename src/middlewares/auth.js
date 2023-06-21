const isUser = (req, res, next) => {
  if (req.session?.email) {
    return next();
  }
  return res.status(401).render("error", { error: "Error de autenticacion." });
};

const isAdmin = (req, res, next) => {
  if (req.session?.isAdmin) {
    return next();
  }
  return res.status(403).render("error", { error: "Error de autorización." });
};

module.exports = { isUser, isAdmin };
