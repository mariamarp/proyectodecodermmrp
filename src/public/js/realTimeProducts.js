const socket = io();

const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');

socket.on('products', (data) => {
    renderProducts(data);
});

function renderProducts(products) {
    productList.innerHTML = ""; 
    
    products.forEach(prod => {
        const div = document.createElement('div');
        div.style.border = "1px solid #ccc";
        div.style.padding = "10px";
        div.style.marginBottom = "10px";
        
        div.innerHTML = `
            <h3>${prod.title}</h3>
            <p>Precio: $${prod.price}</p>
            <p>Código: ${prod.code}</p>
            <p>Stock: ${prod.stock}</p>
            <button onclick="deleteProduct(${prod.id})">Eliminar</button>
        `;
        productList.appendChild(div);
    });
}

productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newProduct = {
        title: document.getElementById('title').value,
        price: parseFloat(document.getElementById('price').value),
        code: document.getElementById('code').value,
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value,
        description: "Descripción por defecto", 
        thumbnails: []
    };

    socket.emit('newProduct', newProduct);
    productForm.reset(); 
});

function deleteProduct(id) {
    socket.emit('deleteProduct', id);
}