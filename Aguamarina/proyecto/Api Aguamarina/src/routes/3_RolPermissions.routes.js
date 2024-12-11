import { Router } from "express";
import { getRolById, getRoles, createRol, updateRolById, deleteRolById } from "../controllers/1_Roles.controller.js";
import { getPermissionsByRol } from "../controllers/3_RolPermissions.controller.js";

const router = Router();

router.get('/rolpermissions/:id', [], getPermissionsByRol); // Obtener por Rol (req.params)


router.get('/roles/:id', [], getRolById); // Obtener por Id (req.params)


router.post('/roles', [], createRol); // Crear (req.body)
router.put('/roles/:id', [], updateRolById); // Editar (req.params y req.body)
router.delete('/roles/:id', [], deleteRolById); // Eliminar (req.params)

export default router;