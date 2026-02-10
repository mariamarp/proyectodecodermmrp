const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const path = require('path');

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const ProductManager = require('./managers/ProductManager');

const app = express();
const PORT = 8080;

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const io = new Server(httpServer);
const productManager = new ProductManager(path.join(__dirname, 'data/products.json'));

io.on('connection', async (socket) => {
    console.log("Nuevo cliente conectado");

    const products = await productManager.getProducts();
    socket.emit('products', products);

    socket.on('newProduct', async (data) => {
        try {
            const currentProducts = await productManager.getProducts();
            const nextId = currentProducts.length > 0 
                ? currentProducts[currentProducts.length - 1].id + 1 
                : 1;
            
            await productManager.addProduct({ id: nextId, status: true, ...data });
            
            const updatedProducts = await productManager.getProducts();
            io.emit('products', updatedProducts); 
        } catch (error) {
            console.error("Error al agregar:", error.message);
        }
    });

    socket.on('deleteProduct', async (id) => {
        try {
            await productManager.deleteProduct(id);
            const updatedProducts = await productManager.getProducts();
            io.emit('products', updatedProducts);
        } catch (error) {
            console.error("Error al eliminar:", error.message);
        }
    });
});