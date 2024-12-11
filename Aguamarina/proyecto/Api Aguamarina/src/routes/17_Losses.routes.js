import { Router } from "express";
import { getLosses, getLossById, getLossesByProduct, createLoss, denyLossById, getLossesByUser } from "../controllers/17_Losses.controller.js";

const router = Router();

router.get('/losses', [], getLosses); // Obtener todo
router.get('/losses/:id', [], getLossById); // Obtener por Id (req.params)
router.get('/losses_user/:id', [], getLossesByUser); // Obtener por User (req.params)
router.get('/losses_product/:id', [], getLossesByProduct); //Obtener por Product (req.params)
router.post('/losses', [], createLoss); // Crear (req.body)
router.patch('/losses/:id', [], denyLossById); // Denegar (req.params)

export default router;