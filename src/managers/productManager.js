const fs = require('fs');

class ProductManager {
    constructor(pathFile) {
        this.path = pathFile;
    }

    async getProducts() {
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

    async addProduct(product) {
        const products = await this.getProducts();

        const { title, description, price, thumbnails, code, stock, category } = product;

        if (!title || !description || !price || !code || !stock || !category) {
            console.log("Error: Todos los campos son obligatorios");
            return; 
        }


        if (products.some(p => p.code === code)) {
            console.log("Error: El código del producto ya existe");
            return;
        }

        const newProduct = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
            title,
            description,
            price,
            thumbnails: thumbnails || [], 
            code,
            stock,
            category,
            status: true
        };

        products.push(newProduct);

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));

        return newProduct;
    }

    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find(p => p.id === parseInt(id));
        
        if (!product) {
            return null; 
        }
        return product;
    }

    async updateProduct(id, updatedFields) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === parseInt(id));

        if (index === -1) return null;

        const productUpdated = { ...products[index], ...updatedFields, id: products[index].id };
        
        products[index] = productUpdated;

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        return productUpdated;
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const filteredProducts = products.filter(p => p.id !== parseInt(id));

        if (products.length === filteredProducts.length) {
            return false; 
        }

        await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, '\t'));
        return true;
    }
}

module.exports = ProductManager;