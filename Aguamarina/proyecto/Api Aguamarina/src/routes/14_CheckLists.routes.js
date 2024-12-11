import { Router } from "express";
import { createCheckList, deleteCheckListById, getCheckListById, getCheckLists, getCheckListsByRent, updateCheckListById } from "../controllers/14_CheckLists.controller.js";

const router = Router();

router.get('/checklists', [], getCheckLists); // Obtener todo
router.get('/checklists/:id', [], getCheckListById); // Obtener por Id (req.params)
router.get('/checklists_rent/:id', [], getCheckListsByRent); // Obtener por Rent (req.params)
router.post('/checklists', [], createCheckList); // Crear (req.body)
router.put('/checklists/:id', [], updateCheckListById); // Editar (req.params y req.body)
router.delete('/checklists/:id', [], deleteCheckListById); // Eliminar (req.params)

export default router;