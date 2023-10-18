const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: SocketServer } = require('socket.io');
const path = require('path');
const env = require('./config/env.config');
const { addLogger, logger } = require('./utils/logger.config');
const productRoutes = require('./routers/products.routes');
const cartRoutes = require('./routers/carts.routes');
const hbsRoutes = require('./routers/handlebars.routes');
const realtimeprodRoutes = require('./routers/realtimeprods.routes');
const messagesRoutes = require('./routers/messages.routes');
const authRoutes = require('./routers/auth.routes');
const mailRoutes = require('./routers/mail.routes');
const mockRoutes = require('./routers/mock.routes');
const userRoutes = require('./routers/users.routes');
const errorHandler = require('./middlewares/error');

const handlebarsConfig = require('./utils/handlebars.config');
const session = require('express-session');
const passport = require('passport');
const compression = require('compression');
const MongoStore = require('connect-mongo');
const websockets = require('./websockets');
const connectMongo = require('./utils/mongo.connect');
const initPassport = require('./config/passport-config');
const flash = require('connect-flash');
const userDTO = require('./model/DTO/user.dto');
const swaggerUI = require('swagger-ui-express');
const swaggerSpecs = require('./utils/swagger.config');

const PORT = env.PORT || 8080;
const SESSION_SECRET = env.SESSION_SECRET;
const MONGO_URL = env.MONGO_URL;
const app = express();
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);

const serverConnected = httpServer.listen(PORT, () => {
  // Conexión a DB Atlas.
  connectMongo()
    .then(() => {
      logger.info('☁ Connected to MongoDB');
    })
    .catch((error) => {
      logger.error('Error connecting to MongoDB:', error);
      throw 'Cannot connect to the database';
    });
  logger.info(`📢 Server listening on port: ${PORT}`);
});

serverConnected.on('error', (error) => logger.error(`Server error: ${error}`));

// Configuración de Swagger
app.use('/apidocs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

// Middlewares
app.use(addLogger);
app.disable('x-powered-by'); // Deshabilita la cabecera X-Powered-By: Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression({})); // Compresión de archivos
app.use('/public', express.static(__dirname + '/public'));

//Usando la configuración de Handlebars importada
app.engine('handlebars', handlebarsConfig);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configuración de la sesión.
app.use(
  session({
    store: MongoStore.create({ mongoUrl: MONGO_URL, ttl: 3600 }),
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

//Passport
initPassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routes
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', mockRoutes);
app.use('/', hbsRoutes); //views
app.use('/realtimeproducts', realtimeprodRoutes);
app.use('/chat', messagesRoutes);
app.use('/auth', authRoutes);
app.use('/mail', mailRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions/current', (req, res) => {
  const infoUser = new userDTO(req.session);
  res.json({ user: infoUser });
});

// Websockets
websockets(io);

// Error handler
app.use(errorHandler);

// Error 404
app.get('*', (req, res) =>
  res.status(404).render('error', {
    error: '⛔ We cannot access the requested route.',
  })
);
