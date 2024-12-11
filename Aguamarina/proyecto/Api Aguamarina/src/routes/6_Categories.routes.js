import { Router } from "express";
import { createCategory, deleteCategoryById, getCategories, getCategoryById, getCategoryByName, updateCategoryById } from "../controllers/6_Categories.controller.js";

const router = Router();

router.get('/categories', [], getCategories); // Obtener todo
router.get('/categories/:id', [], getCategoryById); // Obtener por Id (req.params)
router.get('/categories_name', [], getCategoryByName); // Obtener por Name (req.body)
router.post('/categories', [], createCategory); // Crear (req.body)
router.put('/categories/:id', [], updateCategoryById); // Editar (req.params y req.body)
router.delete('/categories/:id', [], deleteCategoryById); // Eliminar (req.params)

export default router;