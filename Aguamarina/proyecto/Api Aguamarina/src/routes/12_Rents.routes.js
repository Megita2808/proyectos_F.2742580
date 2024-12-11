import { Router } from "express";
import { createRent, deleteRentById, getRentById, getRentByReservation, getRents, getRentsByUser, updateRentById } from "../controllers/12_Rents.controller.js";

const router = Router();

router.get('/rents', [], getRents); // Obtener todo
router.get('/rents/:id', [], getRentById); // Obtener por Id (req.params)
router.get('/rents_user/:id', [], getRentsByUser); // Obtener por User (req.params)
router.get('/rents_reservation/:id', [], getRentByReservation); // Obtener por Reservation (req.params)
router.post('/rents', [], createRent); // Crear (req.body)
router.put('/rents/:id', [], updateRentById); // Editar (req.params y req.body)
router.delete('/rents/:id', [], deleteRentById); // Eliminar (req.params)

export default router;