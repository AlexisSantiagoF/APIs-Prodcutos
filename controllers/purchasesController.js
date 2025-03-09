const { productsCollection } = require('../models/products');
const { purchasesCollection } = require('../models/purchases'); // Agregar colección de compras

// Método GET para obtener todas las compras
exports.getPurchases = async (req, res) => {
  try {
    const snapshot = await purchasesCollection.get();

    // Verificar si hay datos
    if (snapshot.empty) {
      return res.status(404).json({ error: 'No se encontraron compras.' });
    }

    // Mapear las compras
    const purchases = snapshot.docs.map((doc) => {
      const purchaseData = doc.data();

      // ✅ Corrección del manejo de la fecha
      let formattedDate = null;
      if (purchaseData.date) {
        if (purchaseData.date.toDate) {
          // Caso 1: Si es Timestamp de Firestore
          formattedDate = purchaseData.date.toDate().toISOString();
        } else if (purchaseData.date instanceof Date) {
          // Caso 2: Si es tipo Date
          formattedDate = purchaseData.date.toISOString();
        } else if (typeof purchaseData.date === 'string') {
          // Caso 3: Si es tipo String
          formattedDate = purchaseData.date;
        }
      }

      return {
        purchaseId: doc.id,
        productIds: purchaseData.productIds || [],
        userId: purchaseData.userId || 'No registrado',
        category: purchaseData.category || 'Sin categoría',
        total: purchaseData.total || 0,
        date: formattedDate
      };
    });

    return res.status(200).json(purchases);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
  
// Método GET para obtener una compra por ID
exports.getPurchaseById = async (req, res) => {
  try {
    // Obtener el ID de la compra desde los parámetros de la URL
    const { id } = req.params;

    // Buscar la compra en la base de datos
    const purchaseDoc = await purchasesCollection.doc(id).get();

    // Verificar si la compra existe
    if (!purchaseDoc.exists) {
      return res.status(404).json({ error: 'Compra no encontrada' });
    }

    // Obtener los datos de la compra
    const purchaseData = purchaseDoc.data();

    // 🔍 Manejo seguro de la fecha
    let formattedDate = null;
    if (purchaseData.date) {
      if (typeof purchaseData.date === 'string') {
        formattedDate = new Date(purchaseData.date).toISOString();
      } else if (purchaseData.date.toDate) {
        formattedDate = purchaseData.date.toDate().toISOString();
      }
    }

    // Formatear la respuesta
    const purchase = {
      purchaseId: purchaseDoc.id,
      productIds: purchaseData.productIds || [],
      userId: purchaseData.userId || 'No registrado',
      category: purchaseData.category || 'Sin categoría',
      total: purchaseData.total || 0,
      date: formattedDate
    };

    // Enviar la respuesta con los detalles de la compra
    return res.status(200).json(purchase);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear una nueva compra
exports.createPurchase = async (req, res) => {
  try {
    const { productIds, userId, category, total, date } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!productIds || !userId || !category || !total || !date) {
      return res.status(400).json({ error: 'Missing required data in the request.' });
    }

    // Asegurarse que 'productIds' sea siempre un array
    const validProductIds = Array.isArray(productIds) && productIds.length > 0 
      ? productIds 
      : [];

    // Generar un nuevo ID para la compra
    const newPurchaseRef = purchasesCollection.doc();

    // Guardar la compra en la base de datos
    await newPurchaseRef.set({
      productIds: validProductIds,
      userId,
      category,
      total,
      date: new Date(date)
    });

    // Responder con los datos registrados
    return res.status(201).json({
      purchaseId: newPurchaseRef.id,
      productIds: validProductIds,
      userId,
      category,
      total,
      date
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Actualiza una compra
exports.updatePurchase = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID de la compra desde la URL
    const { productIds, userId, category, total, date } = req.body; // Obtener datos del body

    // Validar que se envíe al menos un campo para actualizar
    if (!productIds && !userId && !category && !total && !date) {
      return res.status(400).json({ error: 'No se enviaron datos para actualizar.' });
    }

    // Buscar la compra en la base de datos
    const purchaseDoc = await purchasesCollection.doc(id).get();

    // Verificar si la compra existe
    if (!purchaseDoc.exists) {
      return res.status(404).json({ error: 'Compra no encontrada.' });
    }

    // Obtener datos actuales de la compra
    const existingData = purchaseDoc.data();

    // Actualizar solo los campos proporcionados en el body
    const updatedData = {
      productIds: productIds || existingData.productIds,
      userId: userId || existingData.userId,
      category: category || existingData.category,
      total: total !== undefined ? total : existingData.total,
      date: date ? new Date(date) : existingData.date
    };

    // Actualizar en Firestore
    await purchasesCollection.doc(id).update(updatedData);

    // Formatear fecha en la respuesta
    let formattedDate = null;
    if (updatedData.date) {
      if (updatedData.date.toDate) {
        formattedDate = updatedData.date.toDate().toISOString();
      } else if (updatedData.date instanceof Date) {
        formattedDate = updatedData.date.toISOString();
      } else if (typeof updatedData.date === 'string') {
        formattedDate = updatedData.date;
      }
    }

    // Responder con los datos actualizados
    return res.status(200).json({
      purchaseId: id,
      productIds: updatedData.productIds,
      userId: updatedData.userId,
      category: updatedData.category,
      total: updatedData.total,
      date: formattedDate
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

//Elimina un compra
exports.deletePurchase = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID de la compra desde los parámetros de la URL

    // Buscar la compra en la base de datos
    const purchaseDoc = await purchasesCollection.doc(id).get();

    // Verificar si la compra existe
    if (!purchaseDoc.exists) {
      return res.status(404).json({ error: 'Compra no encontrada.' });
    }

    // Eliminar la compra de la base de datos
    await purchasesCollection.doc(id).delete();

    // Responder con un estado 204, sin contenido
    res.status(200).json({ message: "Compra eliminada correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
