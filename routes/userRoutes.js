const express = require('express');
const router = express.Router();
const { createUser, getUser, updateUser, deleteUser, getAllUsers } = require('../controllers/userController');
const { authenticateToken } = require("../middleware/authMiddleware");

// Definir rutas
router.post('/',authenticateToken, createUser); // Crear usuario
router.get('/',authenticateToken, getAllUsers); // Obtener todos los usuarios
router.get('/:id',authenticateToken, getUser); // Obtener usuario por ID
router.put('/:id',authenticateToken, updateUser); // Actualizar usuario
router.delete('/:id',authenticateToken, deleteUser); // Eliminar usuario

module.exports = router;
