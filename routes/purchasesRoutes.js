const express = require("express");
const router = express.Router();
const purchasesController = require("../controllers/purchasesController");
const { authenticateToken } = require("../middleware/authMiddleware");


router.get("/",authenticateToken, purchasesController.getPurchases);
router.get("/:id",authenticateToken, purchasesController.getPurchaseById);

router.post("/",authenticateToken, purchasesController.createPurchase);

router.put("/:id",authenticateToken, purchasesController.updatePurchase);

router.delete("/:id",authenticateToken, purchasesController.deletePurchase);

module.exports = router;