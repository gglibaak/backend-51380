const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: SocketServer } = require("socket.io");

const productRoutes = require("./routers/mongo/products.routes");
const cartRoutes = require("./routers/carts.routes");
const hbsRoutes = require("./routers/handlebars.routes");
const realTimeProdRoutes = require("./routers/realtimeprods.routes");

const handlerbars = require("express-handlebars");
const path = require("path");
const websockets = require("./websockets");
const connectMongo = require("./utils/mongo.connect");


const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);

const serverConnected = httpServer.listen(PORT, () =>
  console.log(`📢 Server listening on port: ${PORT}`)
);

serverConnected.on("error", (error) => console.log(`Server error: ${error}`));

// Conexión a DB Atlas.
connectMongo();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(__dirname + "/public"));

//usando el engine handlerbars para plantilla
app.engine("handlebars", handlerbars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/", hbsRoutes);
app.use("/realtimeproducts", realTimeProdRoutes);

websockets(io);

app.get("*", (req, res) =>
  res.status(404).send("<h3> ⛔ We cannot access the requested route</h3>")
);
