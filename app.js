const express = require('express');
const app = express();

// Importar rutas correctamente
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const purchasesRoutes = require('./routes/purchasesRoutes')

app.use(express.json());

// Definir rutas
app.use('/apiV1/products', productRoutes);
app.use('/apiV1/categories', categoryRoutes);
app.use('/apiV1/purchases', purchasesRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
