const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const fetch = require('cross-fetch');
const { isValidPassword, createHash } = require('../utils/bcrypt.config');
const MongoCarts = require('../services/carts.services');
const Services = new MongoCarts();
const UserModel = require('../dao/mongo/models/users.model');

const initPassport = () => {
  //############## Local Strategy ##############
  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          const { email, password } = req.body;
          if (!email || !password) {
            req.flash('error', 'Por favor indique su email y password.');
            return done(null, false);
          }

          const user = await UserModel.findOne({ email: username });
          if (!user) {
            req.flash('error', 'Por favor indique su email y password.');
            return done(null, false);
          }

          if (!isValidPassword(password, user.password)) {
            req.flash('error', 'Por favor indique un email o password correcto.');
            return done(null, false);
          }

          req.session.email = user.email;
          req.session.role = user.role;
          req.session.first_name = user.first_name;
          req.session.last_name = user.last_name;
          req.session.age = user.age;
          req.session.cartID = user.cartID;

          return done(null, user);
        } catch (error) {
          return done(new Error(error));
        }
      }
    )
  );

  passport.use(
    'register',
    new LocalStrategy(
      {
        usernameField: 'email',
        passReqToCallback: true,
        failureFlash: true,
      },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email, password, age } = req.body;

          if (!email || !password || !first_name || !last_name || !age) {
            req.flash('error', 'Por favor indique sus datos correctamente.');
            return done(null, false);
          }

          let user = await UserModel.findOne({ email: username });
          if (user) {
            req.flash('error', 'El mail ya se encuentra en uso.');
            return done(null, false);
          }

          const newCart = await Services.addCart();
          const cartID = newCart.result.payload._id.toString();

          const response = await UserModel.create({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cartID,
            role: 'user',
          });

          req.session.email = email;
          req.session.role = 'user';
          req.session.first_name = first_name;
          req.session.last_name = last_name;
          req.session.age = age;
          req.session.cartID = cartID;

          return done(null, response);
        } catch (error) {
          console.log('Error en el registro');
          return done(new Error(error));
        }
      }
    )
  );

  //############## GitHub Strategy ##############

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/auth/github/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        //console.log(profile); // Información que nos devuelve GitHub
        try {
          const res = await fetch('https://api.github.com/user/emails', {
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: 'Bearer ' + accessToken,
              'X-Github-Api-Version': '2022-11-28',
            },
          });
          const emails = await res.json();
          const emailDetail = emails.find((email) => email.verified == true);

          if (!emailDetail) {
            return done(null, false, req.flash('error', 'No se pudo obtener el email del usuario.'));
          }
          profile.email = emailDetail.email;

          let user = await UserModel.findOne({ email: profile.email });

          if (!user) {
            const newCart = await Services.addCart();
            const cartID = newCart.result.payload._id.toString();

            const displayName = profile.displayName ? profile.displayName.split(' ') : [profile.username];

            const lastName = displayName[1] || 'nolastname';
            const firstName = displayName[0] || 'noname';

            const userCreated = await UserModel.create({
              first_name: firstName,
              last_name: lastName,
              email: profile.email,
              age: 18,
              password: 'GitHub-User',
              cartID,
              role: 'user',
            });

            // Usuario Creado correctamente
            return done(null, userCreated);
          } else {
            // Usuario ya existe en la base de datos, procedemos a loguearlo
            return done(null, user);
          }
        } catch (error) {
          console.log('Error en auth github');
          console.log(error);
          return done(new Error(error));
        }
      }
    )
  );
  //############## Facebook Strategy ##############
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        // console.log(profile);
        try {
          const { email } = profile._json;
          let user = await UserModel.findOne({ email: email });
          if (!user) {
            const newCart = await Services.addCart();
            const cartID = newCart.result.payload._id.toString();

            const displayName = profile.displayName.split(' ');
            const lastName = displayName[1] || 'nolastname';
            const firstName = displayName[0] || 'noname';

            /* console.log(
              "Nombre: ",
              firstName,
              "Apellido: ",
              lastName,
              "Email: ",
              email
            ); */

            // console.log("No existe el usuario. Se crearà uno nuevo");

            const userCreated = await UserModel.create({
              first_name: firstName,
              last_name: lastName,
              email,
              age: 18,
              password: 'Facebook-User',
              cartID,
              role: 'user',
            });
            // console.log("Usuario creado correctamente:", userCreated);
            return done(null, userCreated);
          } else {
            // console.log("Usuario ya existe");
            return done(null, user);
          }
        } catch (error) {
          console.log('Error en auth facebook');
          console.log(error);
          return done(new Error(error));
        }
      }
    )
  );

  //############## Google Strategy ##############
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        // console.log(profile);
        try {
          const { email, given_name, family_name } = profile._json;
          let user = await UserModel.findOne({ email: email });
          if (!user) {
            const newCart = await Services.addCart();
            const cartID = newCart.result.payload._id.toString();

            // console.log("No existe el usuario. Se crearà uno nuevo");
            const userCreated = await UserModel.create({
              first_name: given_name,
              last_name: family_name,
              email,
              age: 18,
              password: 'Google-User',
              cartID,
              role: 'user',
            });
            // console.log("Usuario creado correctamente:", userCreated);
            return done(null, userCreated);
          } else {
            // console.log("Usuario ya existe");
            return done(null, user);
          }
        } catch (error) {
          console.log('Error en auth google');
          console.log(error);
          return done(new Error(error));
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById(id);
    done(null, user);
  });
};

module.exports = initPassport;
