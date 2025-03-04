const { db } = require('../firebase'); // Conexión con Firestore
const productsCollection = db.collection('products'); // Colección en Firestore

module.exports = { productsCollection };
