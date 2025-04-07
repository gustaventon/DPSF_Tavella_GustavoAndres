const fs = require('fs');
const path = require('path');
const productsFilePath = path.join(__dirname, '../../data/products.json');

// Helper function to read JSON file
const getProducts = () => {
    try {
        const data = fs.readFileSync(productsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo de productos:', error);  // Muestra el error si no se puede leer el archivo
        return [];  // Devuelve un array vacío si ocurre un error
    }
};

// Helper function to write JSON file
const saveProducts = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

const productController = {
    // Listado de productos
    list: (req, res) => {
        const products = getProducts();
        res.render('listProducts', { products });
    },

    // Mostrar formulario de creación
    createForm: (req, res) => {
        res.render('createProduct');
    },

    // Crear un producto
    create: (req, res) => {
        const products = getProducts();
        const newProduct = {
            id: products.length ? products[products.length - 1].id + 1 : 1,
            name_product: req.body.name_product,
            price: req.body.price,
            description: req.body.description,
            category_product: req.body.category_product,
            size: req.body.size,
            color: req.body.color,
            image: req.file ? `/images/${req.file.filename}` : undefined
        };

        products.push(newProduct);
        saveProducts(products);
        res.redirect('/listProducts');
    },

    // Mostrar detalle de un producto
    detail: (req, res) => {
        const products = getProducts();
        const product = products.find(p => p.id == req.params.id);
        res.render('detailProduct', { product });
    },

    // Mostrar formulario de edición
    editForm: (req, res) => {
        const products = getProducts();
        const product = products.find(p => p.id == req.params.id);
        res.render('editProduct', { product });
    },

    // Actualizar un producto
    update: (req, res) => {
        try {
            const products = getProducts();
            const productIndex = products.findIndex(p => p.id == req.params.id);

            if (productIndex === -1) {
                return res.status(404).send('Producto no encontrado');
            }
            const existingProduct = products[productIndex];

            const newImage = req.file ? `/images/${req.file.filename}` : existingProduct.image;


            const updatedProduct = {
                ...products[productIndex],
                name_product: req.body.name_product,
                price: req.body.price,
                description: req.body.description,
                category_product: req.body.category_product,
                size: req.body.size ? req.body.size.split(',') : existingProduct.size, // Manejar caso en que req.body.size sea undefined
                color: req.body.color ? req.body.color.split(',') : existingProduct.color, // Manejar caso en que req.body.color sea undefined
                image: newImage  // Usa la nueva imagen si se ha subido una
            };

            products[productIndex] = updatedProduct;

            saveProducts(products);
            res.redirect('/listProducts');
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            res.status(500).send('Error interno del servidor');
        }
    },

    // Borrar un producto
    delete: (req, res) => {
        const products = getProducts(); // Obtén la lista de productos
        const filteredProducts = products.filter(p => p.id != req.params.id); // Filtra el producto a eliminar
        saveProducts(filteredProducts); // Guarda la lista actualizada
        res.redirect('/listProducts'); // Redirige a la página de listado de productos
    }
};
module.exports = productController;