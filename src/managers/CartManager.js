const fs = require('fs');
const path = require('path');
const ProductManager = require('./ProductManager'); 

const productsFilePath = path.join(__dirname, '../data/products.json');
const productManager = new ProductManager(productsFilePath);

class CartManager {
    constructor(pathFile) {
        this.path = pathFile;
    }

    async getCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(data);
            }
            return [];
        } catch (error) {
            return [];
        }
    }

    async createCart() {
        const carts = await this.getCarts();
        const newCart = {
            id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
            products: []
        };

        carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        return newCart;
    }

    async getCartById(cid) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === parseInt(cid));
        if (!cart) return null;
        return cart;
    }

    async addProductToCart(cid, pid, quantity = 1) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(c => c.id === parseInt(cid));

        if (cartIndex === -1) {
            throw new Error("Carrito no encontrado");
        }

        const product = await productManager.getProductById(pid);
        if (!product) {
            throw new Error(`El producto con ID ${pid} no existe.`);
        }

        if (product.stock < quantity) {
            throw new Error(`Stock insuficiente. Solo quedan ${product.stock} unidades.`);
        }

        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex(p => p.product === parseInt(pid));

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: parseInt(pid), quantity: quantity });
        }

        carts[cartIndex] = cart;
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        return cart;
    }
}

module.exports = CartManager;