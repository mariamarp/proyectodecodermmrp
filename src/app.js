const express = require('express'); 
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
    let msg = "Hola a todos"
    res.send('<h1 style="color:blue">¡Hola! Bienvenido a mi servidor backend 🚀</h1>');
});

app.get('/saludo', (req, res) => {
    res.send("Hola a todos desde el saludo");
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});