const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const path = require('path');

// Registra el helper eq
handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

// Registra el helper or
handlebars.registerHelper('or', function () {
  const args = Array.prototype.slice.call(arguments, 0, -1);
  return args.some(Boolean);
});

//Usando el engine handlerbars para plantilla
const handlebarsConfig = exphbs.engine({
  layoutsDir: path.join(__dirname, '../views/layouts'),
  partialsDir: path.join(__dirname, '../views/partials'),
});

module.exports = handlebarsConfig;
