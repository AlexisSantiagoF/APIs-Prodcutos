const admin = require('firebase-admin');
const serviceAccount = require('./firebaseConfig.json'); // Ruta del archivo JSON

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { db };
