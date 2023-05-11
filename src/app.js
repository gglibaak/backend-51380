const express = require('express');
const productRoutes = require('./routers/products.routes')
const cartRoutes = require('./routers/carts.routes')

const PORT = 8080
const app = express();

const serverConnectd = app.listen(PORT, ()=> console.log(`📢 Server listening on port: ${PORT}`));

serverConnectd.on('error', error => console.log(`Server error: ${error}`))

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res)=> res.send('<h1> 🌐 Express Server Online</h1>'))

// Routes
app.use('/api', productRoutes);
app.use('/api', cartRoutes);

app.get("*", (req, res) =>
  res.status(404).send("<h3> ⛔ We cannot access the requested route</h3>")
);

