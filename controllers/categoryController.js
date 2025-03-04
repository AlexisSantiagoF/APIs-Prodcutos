const { categoriesCollection } = require('../models/category');

// Obtener todas las categorías
exports.getAllCategories = async (req, res) => {
    try {
        const snapshot = await categoriesCollection.get();
        const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener categorías", error });
    }
};

// Crear una nueva categoría con ID incremental
exports.createCategory = async (req, res) => {
    try {
        const snapshot = await categoriesCollection.get();
        const newCategoryId = snapshot.size + 1;

        const newCategory = {
            id: newCategoryId,
            name: req.body.name
        };

        await categoriesCollection.doc(String(newCategoryId)).set(newCategory);
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: "Error al crear categoría", error });
    }
};
