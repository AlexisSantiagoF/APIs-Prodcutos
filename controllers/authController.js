const User = require('../models/user'); // Importamos el modelo correcto
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = process.env.SECRET_KEY;

exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Verificar si el usuario ya existe en Firestore
        const users = await User.getAllUsers();
        const existingUser = users.find(user => user.username === username);
        
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe!' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear un nuevo usuario en Firestore
        const newUser = {
            username,
            password: hashedPassword,
        };

        // Guardar el nuevo usuario en Firestore
        const userId = await User.create(newUser);

        res.status(201).json({ message: 'Usuario registrado con éxito!', userId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar usuario.' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Obtener todos los usuarios y buscar por username
        const users = await User.getAllUsers();
        const user = users.find(user => user.username === username);

        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas!' });
        }

        // Verificar la contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Credenciales incorrectas!' });
        }

        // Generar el token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            SECRET_KEY,
            { expiresIn: '2h' }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al iniciar sesión.' });
    }
};
