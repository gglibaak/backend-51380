const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: SocketServer } = require("socket.io");

const productRoutes = require("./routers/mongo/products.routes");
const cartRoutes = require("./routers/mongo/carts.routes");
const hbsRoutes = require("./routers/mongo/handlebars.routes");
const realTimeProdRoutes = require("./routers/mongo/realtimeprods.routes");
const chatRoutes = require("./routers/mongo/chat.routes");
const authRoutes = require("./routers/mongo/auth.routes");
const handlerbars = require("express-handlebars");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const websockets = require("./mongo.websockets");
const connectMongo = require("./utils/mongo.connect");
const initPassport = require("./config/passport-config");
const flash = require("connect-flash");

const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);

const serverConnected = httpServer.listen(PORT, () => {
  // Conexión a DB Atlas.
  connectMongo()
    .then(() => {
      console.log("☁ Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
      throw "Cannot connect to the database";
    });
  console.log(`📢 Server listening on port: ${PORT}`);
});

serverConnected.on("error", (error) => console.log(`Server error: ${error}`));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(__dirname + "/public"));

//Usando el engine handlerbars para plantilla
app.engine("handlebars", handlerbars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Configuración de la sesión.
app.use(
  session({
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL, ttl: 3600 }),
    secret: "un-re-secretaso",
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
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/", hbsRoutes);
app.use("/realtimeproducts", realTimeProdRoutes);
app.use("/chat", chatRoutes);
app.use("/auth", authRoutes);
// Deberia estar todo de la misma ruta (api) ??
app.use("/api/sessions/current", (req, res) => {
  res.json({ user: req.session });
});

// Websockets
websockets(io);

app.get("*", (req, res) =>
  res.status(404).render("error", {
    error: "⛔ We cannot access the requested route.",
  })
);
