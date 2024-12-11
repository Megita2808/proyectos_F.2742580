import { Router } from "express";
import { generateCode, getVerificationCodes, validateVerificationCode } from "../controllers/19_VerificationCodes.controller.js";

const router = Router();

router.get('/verificationcodes', [], getVerificationCodes); // Obtener todo
router.post('/verificationcodes_generate', [], generateCode); // Generar Código por Correo (req.params)
router.post('/verificationcodes_validate', [], validateVerificationCode); // Validar Verification Code (req.body)

export default router;