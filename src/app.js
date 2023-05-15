const express = require('express');
const { Server: HttpServer } = require("http");
const { Server: SocketServer } = require("socket.io");

const productRoutes = require('./routers/products.routes');
const cartRoutes = require('./routers/carts.routes');
const hbsRoutes = require('./routers/handlebars.routes');
const realTimeProdRoutes = require('./routers/realtimeprods.routes');

const ProductManager = require("./ProductManager");
const data = new ProductManager("productsDB");

const handlerbars = require('express-handlebars');
const path = require("path");

const PORT = 8080
const app = express();
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);


const serverConnected = httpServer.listen(PORT, ()=> console.log(`📢 Server listening on port: ${PORT}`));

serverConnected.on('error', error => console.log(`Server error: ${error}`))

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(__dirname + "/public"));

//usando el engine handlerbars para plantilla
app.engine("handlebars", handlerbars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));


// Routes
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/', hbsRoutes);
app.use('/realtimeproducts', realTimeProdRoutes);

app.get("*", (req, res) =>
  res.status(404).send("<h3> ⛔ We cannot access the requested route</h3>")
);

// Socket Events
io.on("connection", async (socket) => {
  console.log(`New Client Connection with ID: ${socket.id}`);

  // Envío de lista de productos al cliente
  const productsList = await data.getProducts();
  socket.emit("products", productsList);

  // Escuchando y Enviando
  socket.on("new-product", async (newProd) => {
    try {
      await data.addProduct({ ...newProd });

      // Actualizando lista despues de agregar producto nuevo
      const productsList = await data.getProducts();

      // Enviando lista a los clientes
      io.emit("products", productsList);
    } catch (error) {
      console.log(error);
    }
  });
});
