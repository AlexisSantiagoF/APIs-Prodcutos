const admin = require("firebase-admin");
const db = admin.firestore();

const purchasesCollection = db.collection("purchases");

module.exports = { purchasesCollection };
