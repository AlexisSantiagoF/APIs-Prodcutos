const { db } = require('../firebase'); // Conexión con Firestore

class User {
    static usersCollection = db.collection('users');
    // Función para crear un nuevo usuario
    static async create(userData) {
        const userRef = await this.usersCollection.add(userData);
        return userRef.id;
    }
    // Función para obtener todos los usuarios
    static async getAllUsers() {
        const snapshot = await this.usersCollection.get();
        const users = [];
    
        snapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });
    
        return users;
    }
    
    // Función para obtener un usuario por su ID
    static async getById(userId) {
        const doc = await this.usersCollection.doc(userId).get();
        return doc.exists ? doc.data() : null;
    }

    // Función para actualizar un usuario
    static async update(userId, updateData) {
        await this.usersCollection.doc(userId).update(updateData);
        return { success: true, message: 'Usuario actualizado' };
    }

    // Función para eliminar un usuario
    static async delete(userId) {
        await this.usersCollection.doc(userId).delete();
        return { success: true, message: 'Usuario eliminado' };
    }
}
// Exportamos la clase User
module.exports = User;
