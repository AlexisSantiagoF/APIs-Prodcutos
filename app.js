require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const app = express();
const path = require("path");

// Importar rutas correctamente
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const purchasesRoutes = require('./routes/purchasesRoutes')
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
app.use(express.json());

// Definir rutas
app.use('/apiV1/products', productRoutes);
app.use('/apiV1/categories', categoryRoutes);
app.use('/apiV1/purchases', purchasesRoutes)
app.use('/apiV1/users', userRoutes);
app.use('/apiV1/auth', authRoutes);

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

// Manejo de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Algo salió mal, por favor intente más tarde.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
