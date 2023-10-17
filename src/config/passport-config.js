const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const env = require('./env.config');
const fetch = require('cross-fetch');
const { isValidPassword, createHash } = require('../utils/bcrypt.config');
const MongoCarts = require('../services/carts.services');
const Services = new MongoCarts();
const UserModel = require('../model/schemas/users.schema');

const GITHUB_CLIENT_ID = env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = env.GITHUB_CLIENT_SECRET;
const FACEBOOK_CLIENT_ID = env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = env.FACEBOOK_CLIENT_SECRET;
const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;
const PROJECT_URL = env.PROJECT_URL;

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

          //Actualiza la ultima conexion
          user.last_connection = new Date();
          await user.save();

          req.session.email = user.email;
          req.session.role = user.role;
          req.session.first_name = user.first_name;
          req.session.last_name = user.last_name;
          req.session.age = user.age;
          req.session.cartID = user.cartID;
          req.session.orders = user.orders;
          req.session.documents = user.documents;
          req.session._id = user._id.toString();

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
            orders: [],
            documents: [],
            last_connection: new Date(),
          });

          req.session.email = email;
          req.session.role = 'user';
          req.session.first_name = first_name;
          req.session.last_name = last_name;
          req.session.age = age;
          req.session.cartID = cartID;
          req.session.orders = [];
          req.session.documents = [];

          return done(null, response);
        } catch (error) {
          console.log('Error en el registro', error);
          return done(new Error(error));
        }
      }
    )
  );

  //############## GitHub Strategy ##############

  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: PROJECT_URL + '/auth/github/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
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
              orders: [],
              documents: [],
              last_connection: new Date(),
            });

            // Usuario Creado correctamente
            return done(null, userCreated);
          } else {
            // Usuario ya existe en la base de datos, procedemos a loguearlo
            return done(null, user);
          }
        } catch (error) {
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
        clientID: FACEBOOK_CLIENT_ID,
        clientSecret: FACEBOOK_CLIENT_SECRET,
        callbackURL: PROJECT_URL + '/auth/facebook/callback',
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

            const userCreated = await UserModel.create({
              first_name: firstName,
              last_name: lastName,
              email,
              age: 18,
              password: 'Facebook-User',
              cartID,
              role: 'user',
              orders: [],
              documents: [],
              last_connection: new Date(),
            });

            return done(null, userCreated);
          } else {
            return done(null, user);
          }
        } catch (error) {
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
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: PROJECT_URL + '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { email, given_name, family_name } = profile._json;
          let user = await UserModel.findOne({ email: email });
          if (!user) {
            const newCart = await Services.addCart();
            const cartID = newCart.result.payload._id.toString();

            const userCreated = await UserModel.create({
              first_name: given_name,
              last_name: family_name,
              email,
              age: 18,
              password: 'Google-User',
              cartID,
              role: 'user',
              orders: [],
              documents: [],
              last_connection: new Date(),
            });
            return done(null, userCreated);
          } else {
            return done(null, user);
          }
        } catch (error) {
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
