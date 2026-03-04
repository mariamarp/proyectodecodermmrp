import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import __dirname from './utils.js'; 

const app = express();

mongoose.connect("mongodb+srv://mariamarp_db_user:w0Jgg7RZeZizXMPW@cluster0.cmfipkb.mongodb.net/ecommerce?retryWrites=true&w=majority")
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch(error => console.error("❌ Error en conexión:", error));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

app.listen(8080, () => console.log("🚀 Servidor corriendo en puerto 8080"));