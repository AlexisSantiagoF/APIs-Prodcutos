const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/:id/history", productController.getPriceHistory);

// 📌 Nueva ruta para obtener sugerencias de productos
router.get("/:id/sugerencias", productController.getProductSuggestions);

// Nueva ruta para permite analizar fluctuaciones de precios y predecir tendencias de descuentos.
router.get("/:id/tendenciasPrecios",productController.predictPriceTrend)

module.exports = router;
