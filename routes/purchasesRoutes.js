const express = require("express");
const router = express.Router();
const purchasesController = require("../controllers/purchasesController");

router.get("/", purchasesController.getPurchases);
router.get("/:id", purchasesController.getPurchaseById);

router.post("/", purchasesController.createPurchase);

router.put("/:id", purchasesController.updatePurchase);

router.delete("/:id", purchasesController.deletePurchase);

module.exports = router;