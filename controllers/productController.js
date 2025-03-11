const { productsCollection } = require('../models/products');
const { purchasesCollection } = require('../models/purchases'); // Agregar colección de compras

// Obtener sugerencias de productos basadas en compras previas
exports.getProductSuggestions = async (req, res) => {
    try {
        const { id } = req.params; // ID del usuario

        // Obtener compras previas del usuario
        const userPurchasesSnapshot = await purchasesCollection.where('idUsuario', '==', id).get();
        if (userPurchasesSnapshot.empty) {
            return res.status(200).json({ message: "No hay compras previas, no se pueden generar sugerencias.", sugerencias: [] });
        }

        // Extraer IDs de productos comprados
        const purchasedProductIds = new Set();
        userPurchasesSnapshot.forEach(doc => {
            const purchaseData = doc.data();
            if (purchaseData.productosIds&& Array.isArray(purchaseData.productosIds)) {
                purchaseData.productosIds.forEach(productId => {
                    purchasedProductIds.add(productId);
                });
            }
        });

        // Obtener categorías de los productos comprados
        const purchasedCategories = new Set();
        for (let productId of purchasedProductIds) {
            const productDoc = await productsCollection.doc(productId).get();
            if (productDoc.exists) {
                const productData = productDoc.data();
                if (productData.categoria) {
                    purchasedCategories.add(productData.categoria);
                }
            }
        }

        // Buscar productos en las mismas categorías
        const suggestedProducts = [];
        for (let category of purchasedCategories) {
            const productsSnapshot = await productsCollection.where('categoria', '==', category).get();
            productsSnapshot.forEach(doc => {
                suggestedProducts.push({ id: doc.id, ...doc.data() });
            });
        }

        res.status(200).json({ sugerencias: suggestedProducts });

    } catch (error) {
        res.status(500).json({ message: "Error al obtener sugerencias de productos", error });
    }
};

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
            historialPrecios: req.body.historialPrecios || []
        };

        const productRef = await productsCollection.add(newProduct);
        res.status(201).json({ id: productRef.id, ...newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error al crear producto", error });
    }
};

// Actualizar producto con historial de precios dinámico 
exports.updateProduct = async (req, res) => {
    try {
        const productDoc = productsCollection.doc(req.params.id);
        const productSnapshot = await productDoc.get();

        if (!productSnapshot.exists) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const productData = productSnapshot.data();
        const nuevoPrecio = req.body.precio;

        if (nuevoPrecio && productData.precio !== nuevoPrecio) {
            const historialPrecios = productData.historialPrecios || [];
            historialPrecios.push({
                fecha: new Date().toISOString(),
                precioAnterior: productData.precio
            });

            await productDoc.update({
                precio: nuevoPrecio,
                historialPrecios: historialPrecios
            });
        } else {
            await productDoc.update(req.body);
        }

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


// Obtener historial de precios de un producto
exports.getPriceHistory = async (req, res) => {
    try {
        const productDoc = await productsCollection.doc(req.params.id).get();

        if (!productDoc.exists) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const productData = productDoc.data();
        res.status(200).json({ id: productDoc.id, historialPrecios: productData.historialPrecios || [] });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener historial de precios", error });
    }
};

// 🔹 Obtener sugerencias inteligentes de productos
// exports.getProductSuggestions = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const productDoc = await productsCollection.doc(id).get();

//         if (!productDoc.exists) {
//             return res.status(404).json({ message: "Producto no encontrado" });
//         }

//         const { categoria } = productDoc.data();

//         // 🔹 Buscar productos de la misma categoría
//         const similarProductsSnapshot = await productsCollection
//             .where("categoria", "==", categoria)
//             .where("__name__", "!=", id) // Excluir el mismo producto
//             .limit(3)
//             .get();

//         let similarProducts = similarProductsSnapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data()
//         }));

//         // 🔹 Buscar compras previas donde esté el producto actual
//         const purchasesSnapshot = await purchasesCollection
//             .where("productosComprados", "array-contains", id)
//             .limit(3)
//             .get();

//         let relatedProducts = [];
//         purchasesSnapshot.forEach(purchase => {
//             const { productosComprados } = purchase.data();
//             productosComprados.forEach(prodId => {
//                 if (prodId !== id && !relatedProducts.includes(prodId)) {
//                     relatedProducts.push(prodId);
//                 }
//             });
//         });

//         // 🔹 Obtener detalles de productos relacionados
//         let detailedRelatedProducts = [];
//         if (relatedProducts.length > 0) {
//             const relatedProductsDocs = await Promise.all(
//                 relatedProducts.map(prodId => productsCollection.doc(prodId).get())
//             );

//             detailedRelatedProducts = relatedProductsDocs
//                 .filter(doc => doc.exists)
//                 .map(doc => ({
//                     id: doc.id,
//                     ...doc.data()
//                 }));
//         }

//         res.json({
//             sugerenciasCategoria: similarProducts,
//             sugerenciasPorCompras: detailedRelatedProducts
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Error al obtener sugerencias", error });
//     }
// };
