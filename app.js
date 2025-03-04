const express = require('express');
const app = express();
const productRoutes = require('./routers/productRoutes');

app.use(express.json());

app.use('/apiV1/products', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
