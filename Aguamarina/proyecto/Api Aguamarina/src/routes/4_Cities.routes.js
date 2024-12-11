import { Router } from "express";
import { createCity, deleteCityById, getCities, getCityById, updateCityById } from "../controllers/4_Cities.controller.js";

const router = Router();

router.get('/cities', [], getCities); // Obtener todo
router.get('/cities/:id', [], getCityById); // Obtener por Id (req.params)
router.post('/cities', [], createCity); // Crear (req.body)
router.put('/cities/:id', [], updateCityById); // Editar (req.params y req.body)
router.delete('/cities/:id', [], deleteCityById); // Eliminar (req.params)

export default router;