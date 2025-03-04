const { db } = require('../firebase'); // Conexión a Firestore
const categoriesCollection = db.collection('categories'); // Colección de categorías en Firestore

module.exports = { categoriesCollection };
