const { productsCollection } = require('../models/products');
const { purchasesCollection } = require('../models/purchases'); // Agregar colección de compras
const User = require('../models/user'); // Importar el modelo de usuario

// Método GET para obtener todas las compras
exports.getPurchases = async (req, res) => {
  try {
    const snapshot = await purchasesCollection.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'No se encontraron compras.' });
    }

    const compras = snapshot.docs.map((doc) => {
      const purchaseData = doc.data();

      let formattedDate = null;
      if (purchaseData.fecha) {
        if (purchaseData.fecha.toDate) {
          formattedDate = purchaseData.fecha.toDate().toISOString();
        } else if (purchaseData.fecha instanceof Date) {
          formattedDate = purchaseData.fecha.toISOString();
        } else if (typeof purchaseData.fecha === 'string') {
          formattedDate = purchaseData.fecha;
        }
      }

      return {
        idCompra: doc.id,
        productosIds: purchaseData.productosIds || [],
        idUsuario: purchaseData.idUsuario || 'No registrado',
        total: purchaseData.total || 0,
        fecha: formattedDate
      };
    });

    return res.status(200).json(compras);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
  
// Método GET para obtener una compra por ID
exports.getPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;

    const purchaseDoc = await purchasesCollection.doc(id).get();

    if (!purchaseDoc.exists) {
      return res.status(404).json({ error: 'Compra no encontrada.' });
    }

    const purchaseData = purchaseDoc.data();

    let formattedDate = null;
    if (purchaseData.fecha) {
      if (typeof purchaseData.fecha === 'string') {
        formattedDate = new Date(purchaseData.fecha).toISOString();
      } else if (purchaseData.fecha.toDate) {
        formattedDate = purchaseData.fecha.toDate().toISOString();
      }
    }

    const compra = {
      idCompra: purchaseDoc.id,
      productosIds: purchaseData.productosIds || [],
      idUsuario: purchaseData.idUsuario || 'No registrado',
      total: purchaseData.total || 0,
      fecha: formattedDate
    };

    return res.status(200).json(compra);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Crear una nueva compra
exports.createPurchase = async (req, res) => {
  try {
    const { productosId, idUsuario, total, fecha } = req.body;

    if (!productosId || !idUsuario || !total || !fecha) {
      return res.status(400).json({ error: 'Faltan datos requeridos en la solicitud.' });
    }

    const userDoc = await User.usersCollection.doc(idUsuario).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const productosIds = Array.isArray(productosId) && productosId.length > 0 
      ? productosId 
      : [];

    const newPurchaseRef = purchasesCollection.doc();

    await newPurchaseRef.set({
      productosIds: productosIds,
      idUsuario: idUsuario,
      total,
      fecha: new Date(fecha)
    });

    const userData = userDoc.data();
    const updatedCompras = userData.idCompras ? [...userData.idCompras, newPurchaseRef.id] : [newPurchaseRef.id];

    await User.usersCollection.doc(idUsuario).update({
      idCompras: updatedCompras
    });

    return res.status(201).json({
      idCompra: newPurchaseRef.id,
      productosIds: productosIds,
      idUsuario: idUsuario,
      total,
      fecha: new Date(fecha)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Actualiza una compra
exports.updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const { productosIds, idUsuario, total, fecha } = req.body;

    if (!productosIds && !idUsuario && !total && !fecha) {
      return res.status(400).json({ error: 'No se enviaron datos para actualizar.' });
    }

    const purchaseDoc = await purchasesCollection.doc(id).get();

    if (!purchaseDoc.exists) {
      return res.status(404).json({ error: 'Compra no encontrada.' });
    }

    const existingData = purchaseDoc.data();

    const updatedData = {
      productosIds: productosIds || existingData.productosIds,
      idUsuario: idUsuario || existingData.idUsuario,
      total: total !== undefined ? total : existingData.total,
      fecha: fecha ? new Date(fecha) : existingData.fecha
    };

    await purchasesCollection.doc(id).update(updatedData);

    let formattedDate = null;
    if (updatedData.fecha) {
      if (updatedData.fecha.toDate) {
        formattedDate = updatedData.fecha.toDate().toISOString();
      } else if (updatedData.fecha instanceof Date) {
        formattedDate = updatedData.fecha.toISOString();
      } else if (typeof updatedData.fecha === 'string') {
        formattedDate = updatedData.fecha;
      }
    }

    return res.status(200).json({
      idCompra: id,
      productosIds: updatedData.productosIds,
      idUsuario: updatedData.idUsuario,
      total: updatedData.total,
      fecha: formattedDate
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
