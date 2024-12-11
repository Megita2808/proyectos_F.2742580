import { Router } from "express";
import { checkAuth, checkCookie, forgotPassword, resetPassword, validateLogin, validateLogout, validateToken } from "../controllers/21_Authentications.controller.js";

const router = Router();

router.post('/validate_login', [], validateLogin); // Login validado (req.body)
router.post('/validate_token', [], validateToken); // Validar Token JWT (req.cookie o req.body)
router.post('/validate_logout', [], validateLogout); // Cerrar Sesión (req.cookie)

router.get('/check_auth', [], checkAuth); // Validar Sesión Iniciado (req.cookie)
router.post('/check_cookie', [], checkCookie); // Obtener Payload de la Cookie (req.body)

//Rutas de restablecimiento de contraseña
router.post('/forgot_password', [], forgotPassword); // Enviar Correo de Reestablecimiento (req.body)
router.post('/reset_password', [], resetPassword); // Restablecer Contraseña (req.body)

export default router;