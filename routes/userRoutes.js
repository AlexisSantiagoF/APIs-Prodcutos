const express = require('express');
const router = express.Router();
const { createUser, getUser, updateUser, deleteUser, getAllUsers } = require('../controllers/userController');

// Definir rutas
router.post('/', createUser); // Crear usuario
router.get('/', getAllUsers); // Obtener todos los usuarios
router.get('/:id', getUser); // Obtener usuario por ID
router.put('/:id', updateUser); // Actualizar usuario
router.delete('/:id', deleteUser); // Eliminar usuario

module.exports = router;
