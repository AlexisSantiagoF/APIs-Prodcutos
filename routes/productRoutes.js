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

module.exports = router;
