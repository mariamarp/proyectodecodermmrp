const fs = require('fs');

class ProductManager {
    constructor(pathFile) {
        this.path = pathFile;
    }

    // 1. Método auxiliar para leer siempre el archivo actualizado
    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(data);
            }
            return []; // Si no existe el archivo, devuelve array vacío
        } catch (error) {
            return [];
        }
    }

    async addProduct(product) {
        // Reutilizamos getProducts para leer
        const products = await this.getProducts(); 

        // Validaciones
        if (!product.title || !product.description || !product.price || !product.code || !product.stock || !product.category) {
            // CAMBIO IMPORTANTE: Usamos throw Error para que el Router pueda atraparlo (catch) y mandar un error 400
            throw new Error("Faltan campos obligatorios");
        }

        if (products.some(p => p.code === product.code)) {
            throw new Error("El código del producto ya existe");
        }

        const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

        const newProduct = {
            id: newId,
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnails || [], // Si no viene, ponemos array vacío
            code: product.code,
            stock: product.stock,
            category: product.category,
            status: true // Por defecto true
        };

        products.push(newProduct);

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));

        return newProduct;
    }

    // Corregido: Ahora es async y busca en el archivo
    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find(p => p.id === parseInt(id));
        
        if (!product) {
            return null; // Devolvemos null para que el router sepa que no existe
        }
        return product;
    }

    // Agregado: updateProduct (Requisito para PUT)
    async updateProduct(id, updatedFields) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === parseInt(id));

        if (index === -1) return null;

        // Actualizamos sin tocar el ID
        const productUpdated = { ...products[index], ...updatedFields, id: products[index].id };
        
        products[index] = productUpdated;

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        return productUpdated;
    }

    // Agregado: deleteProduct (Requisito para DELETE)
    async deleteProduct(id) {
        const products = await this.getProducts();
        const filteredProducts = products.filter(p => p.id !== parseInt(id));

        if (products.length === filteredProducts.length) {
            return false; // No se borró nada porque no existía el ID
        }

        await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, '\t'));
        return true;
    }
}

module.exports = ProductManager;