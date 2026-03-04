import { Router } from 'express';
import { productsModel } from '../models/products.model.js';

const router = Router();

router.get('/products', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages } = 
        await productsModel.paginate({}, { limit, page, lean: true });

    res.render('products', {
        products: docs,
        page,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        totalPages
    });
});

router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = await cartsModel.findOne({ _id: cid }).lean();
    res.render('cart', { cart });
});

export default router;