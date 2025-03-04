const { db } = require('../firebase');

const collection = db.collection('tasks');

const getAllTasks = async () => {
    const snapshot = await collection.get();
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

const getTaskById = async (id) => {
    const doc = await collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
};

const createTask = async (title) => {
    const newTask = { title };
    const docRef = await collection.add(newTask);
    return { id: docRef.id, ...newTask };
};

const updateTask = async (id, title) => {
    const doc = await collection.doc(id).get();
    if (!doc.exists) return null;

    await collection.doc(id).update({ title });
    return { id, title };
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask
};
