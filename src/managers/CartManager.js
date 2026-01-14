const fs = require('fs');

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

    async addProductToCart(cid, pid) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(c => c.id === parseInt(cid));

        if (cartIndex === -1) return null;

        const cart = carts[cartIndex];
        // Verificar si el producto ya existe en el carrito
        const productIndex = cart.products.findIndex(p => p.product === parseInt(pid));

        if (productIndex !== -1) {
            // Si existe, sumamos cantidad
            cart.products[productIndex].quantity++;
        } else {
            // Si no existe, lo agregamos con id y cantidad 1
            cart.products.push({ product: parseInt(pid), quantity: 1 });
        }

        carts[cartIndex] = cart;
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        return cart;
    }
}

module.exports = CartManager;