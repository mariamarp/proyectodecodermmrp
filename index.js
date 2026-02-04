const productManager = require ("./managers/productManager");

const manager = new productManager ();

console.log(manager)
console.log(manager.getProductsById())

const product1= {
    title:"X",
    description:"XX",
    stock:"XXX",
    price: "123",
    code: "asd",
}
manager.addProduct(producto1)

console.log(manager.getProducts());