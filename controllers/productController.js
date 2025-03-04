const { productsCollection } = require('../models/products');

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
    try {
        const snapshot = await productsCollection.get();
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos", error });
    }
};

// Obtener un producto por ID
exports.getProductById = async (req, res) => {
    try {
        const productDoc = await productsCollection.doc(req.params.id).get();
        if (!productDoc.exists) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json({ id: productDoc.id, ...productDoc.data() });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener producto", error });
    }
};

// Crear un producto con la estructura definida en Firestore
exports.createProduct = async (req, res) => {
    try {
        const snapshot = await productsCollection.get();
        const newProductId = snapshot.size + 1;

        const newProduct = {
            nombre: req.body.nombre,
            precio: req.body.precio,
            enStock: req.body.enStock,
            categoria: req.body.categoria,
            detalles: {
                procesador: req.body.detalles.procesador,
                ram: req.body.detalles.ram,
                almacenamiento: req.body.detalles.almacenamiento
            },
            historialPrecios: req.body.historialPrecios || [] // Si no se envía, se deja vacío
        };

        await productsCollection.doc(String(newProductId)).set(newProduct);
        res.status(201).json({ id: newProductId, ...newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error al crear producto", error });
    }
};

// Actualizar un producto por ID
exports.updateProduct = async (req, res) => {
    try {
        const productDoc = productsCollection.doc(req.params.id);
        const productSnapshot = await productDoc.get();

        if (!productSnapshot.exists) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        await productDoc.update(req.body);
        res.status(200).json({ id: req.params.id, ...req.body });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar producto", error });
    }
};

// Eliminar un producto por ID
exports.deleteProduct = async (req, res) => {
    try {
        const productDoc = productsCollection.doc(req.params.id);
        const productSnapshot = await productDoc.get();

        if (!productSnapshot.exists) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        await productDoc.delete();
        res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar producto", error });
    }
};
