const { Router } = require('express');
const CartManager = require('../managers/CartManager');
const path = require('path');

const router = Router();
const cartManager = new CartManager(path.join(__dirname, '../data/carts.json'));

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body; 

        const cart = await cartManager.addProductToCart(cid, pid, quantity || 1);
        
        res.json(cart);
    } catch (error) {
        if (error.message.includes("no existe") || error.message.includes("encontrado")) {
             return res.status(404).json({ error: error.message });
        }
        if (error.message.includes("Stock")) {
             return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;