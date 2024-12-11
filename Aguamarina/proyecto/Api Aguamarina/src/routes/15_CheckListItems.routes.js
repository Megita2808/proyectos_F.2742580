import { Router } from "express";
import { createCheckListItem, deleteCheckListItemById, getCheckListItemById, getCheckListItems, getCheckListItemsByCheckList, updateCheckListItemById } from "../controllers/15_CheckListItems.controller.js";

const router = Router();

router.get('/checklistitems', [], getCheckListItems); // Obtener todo
router.get('/checklistitems/:id', [], getCheckListItemById); // Obtener por Id (req.params)
router.get('/checklistitems_checklist/:id', [], getCheckListItemsByCheckList); // Obtener por CheckList (req.params)
router.post('/checklistitems', [], createCheckListItem); // Crear (req.body)
router.put('/checklistitems/:id', [], updateCheckListItemById); // Editar (req.params y req.body)
router.delete('/checklistitems/:id', [], deleteCheckListItemById); // Eliminar (req.params)

export default router;