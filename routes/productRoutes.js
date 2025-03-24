const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/", authenticateToken, productController.getAllProducts);
router.get("/:id", authenticateToken, productController.getProductById);
router.post("/", authenticateToken, productController.createProduct);
router.put("/:id", authenticateToken, productController.updateProduct);
router.delete("/:id", authenticateToken, productController.deleteProduct);
router.get("/:id/history", authenticateToken, productController.getPriceHistory);

// 📌 Nueva ruta para obtener sugerencias de productos
router.get("/:id/sugerencias", authenticateToken, productController.getProductSuggestions);

// Nueva ruta para permite analizar fluctuaciones de precios y predecir tendencias de descuentos.
router.get("/:id/tendenciasPrecios", authenticateToken, productController.predictPriceTrend)

module.exports = router;
