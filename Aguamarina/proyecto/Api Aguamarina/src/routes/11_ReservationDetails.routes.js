import { Router } from "express";
import { createReservationDetails, deleteReservationDetailById, getDetailsByReservation, getReservationDetails, updateReservationDetailById } from "../controllers/11_ReservationDetails.controller.js";

const router = Router();

router.get('/reservationdetails', [], getReservationDetails); // Obtener todo
router.get('/details_reservation/:id', [], getDetailsByReservation); // Obtener por Reservation (req.params)
router.post('/reservationdetails', [], createReservationDetails); // Crear (req.body)
router.put('/reservationdetails', [], updateReservationDetailById); // Editar (req.body)
router.delete('/reservationdetails', [], deleteReservationDetailById); // Eliminar (req.body)

export default router;