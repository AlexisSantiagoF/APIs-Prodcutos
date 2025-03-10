const User = require('../models/user');
const Products = require('../models/products');

// Función para crear un nuevo usuario
const createUser = async (req, res) => {
    try {
        const userId = await User.create(req.body); // Cambié de User.createUser a User.create
        res.status(201).json({ success: true, userId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Función para obtener todos los usuarios
const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Función para obtener un usuario por su ID
const getUser = async (req, res) => {
    try {
        const user = await User.getById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Función para actualizar un usuario
const updateUser = async (req, res) => {
    try {
        const result = await User.update(req.params.id, req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Función para eliminar un usuario
const deleteUser = async (req, res) => {
    try {
        const result = await User.delete(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Exportar las funciones
module.exports = { getAllUsers, createUser, getUser, updateUser, deleteUser };