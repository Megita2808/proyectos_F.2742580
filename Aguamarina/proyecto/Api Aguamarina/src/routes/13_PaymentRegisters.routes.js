import { Router } from "express";
import { createPaymentRegister, deletePaymentRegisterById, getPaymentRegisterById, getPaymentRegisters, getPaymentRegistersByRent, updatePaymentRegisterById } from "../controllers/13_PaymentRegisters.controller.js";

const router = Router();

router.get('/paymentregisters', [], getPaymentRegisters); // Obtener todo
router.get('/paymentregisters/:id', [], getPaymentRegisterById); // Obtener por Id (req.params)
router.get('/paymentregisters_rent/:id', [], getPaymentRegistersByRent); // Obtener por Rent (req.params)
router.post('/paymentregisters', [], createPaymentRegister); // Crear (req.body)
router.put('/paymentregisters/:id', [], updatePaymentRegisterById); // Editar (req.params y req.body)
router.delete('/paymentregisters/:id', [], deletePaymentRegisterById); // Eliminar (req.params)

export default router;