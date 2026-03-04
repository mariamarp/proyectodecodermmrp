import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js';
import viewsRouter from './src/routes/views.router.js';
import __dirname from './src/utils.js'; 

const app = express();
const PORT = 8080;

const MONGO_URL = "mongodb+srv://mariamarp_db_user:w0Jgg7RZeZizXMPW@cluster0.cmfipkb.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("✅ ¡Conectado con éxito a MongoDB Atlas, Manu!");
    })
    .catch(error => {
        console.error("❌ Error al conectar a la base de datos:", error);
    });

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});