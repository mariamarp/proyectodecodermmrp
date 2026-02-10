const { Router } = require('express');
const ProductManager = require('../managers/ProductManager');
const path = require('path');

const router = Router();

const rutaExacta = path.join(process.cwd(), 'src/data/products.json');
const productManager = new ProductManager(rutaExacta);

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products, title: "Inicio" });
    } catch (error) {
        res.status(500).send('Error al cargar home');
    }
});

router.get('/products', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products, title: "Productos Estáticos" });
    } catch (error) {
        res.status(500).send('Error al cargar productos');
    }
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { title: "Tiempo Real" });
});

module.exports = router;