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

// Obtener categoría por ID
exports.getCategoryById = async (req, res) => {
    try {
        const categoryDoc = await categoriesCollection.doc(req.params.id).get();
        if (!categoryDoc.exists) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }
        res.status(200).json({ id: categoryDoc.id, ...categoryDoc.data() });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener categoría", error });
    }
};
