import { Router } from "express";
import { createAddress, deleteAddressById, getAddressById, getAddresses, getAddressesByUser, updateAddressById } from "../controllers/5_Addresses.controller.js";

const router = Router();

router.get('/addresses', [], getAddresses); // Obtener todo
router.get('/addresses/:id', [], getAddressById); // Obtener por Id (req.params)
router.get('/addresses_user/:id', [], getAddressesByUser) // Obtener por Usuario (req.params)
router.post('/addresses', [], createAddress); // Crear (req.body)
router.put('/addresses/:id', [], updateAddressById); // Editar (req.params y req.body)
router.delete('/addresses/:id', [], deleteAddressById); // Eliminar (req.params)

export default router;