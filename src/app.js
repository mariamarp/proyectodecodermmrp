const express = require('express');

const users = require('./mock-user.js');

const path = require('path'); 
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
    res.send('<h1 style="color:blue">¡Hola! Bienvenido a mi servidor backend 🚀</h1>');
});

app.get("/file", (req, res) => {
    const rutaArchivo = path.join(process.cwd(), 'index.html');
    res.sendFile(rutaArchivo);
});

app.get('/users', (req, res) => {
    res.json(users);
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});