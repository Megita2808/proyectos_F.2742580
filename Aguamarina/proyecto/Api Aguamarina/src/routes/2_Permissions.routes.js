import { Router } from "express";
import { createPermission, deletePermissionById, getPermissionById, getPermissions, updatePermissionById } from "../controllers/2_Permissions.controller.js";

const router = Router();

router.get('/permissions', [], getPermissions); // Obtener todo
router.get('/permissions/:id', [], getPermissionById); // Obtener por Id (req.params)
router.post('/permissions', [], createPermission); // Crear (req.body)
router.put('/permissions/:id', [], updatePermissionById); // Editar (req.params y req.body)
router.delete('/permissions/:id', [], deletePermissionById); // Eliminar (req.params)

export default router;