import { Router } from "express";
import { createPurchase, denyPurchaseById, getPurchaseById, getPurchases, getPurchasesByProduct, getPurchasesByUser} from "../controllers/16_Purchases.controller.js";

const router = Router();

router.get('/purchases', [], getPurchases); // Obtener todo
router.get('/purchases/:id', [], getPurchaseById); // Obtener por Id (req.params)
router.get('/purchases_user/:id', [], getPurchasesByUser); // Obtener por User (req.params)
router.get('/purchases_product/:id', [], getPurchasesByProduct); //Obtener por Product (req.params)
router.post('/purchases', [], createPurchase); // Crear (req.body)
router.patch('/purchases/:id', [], denyPurchaseById); // Denegar (req.params)

export default router;