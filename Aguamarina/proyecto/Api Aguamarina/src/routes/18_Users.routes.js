import { Router } from "express";
import { changeStatusById, createUser, deleteUserById, getUserById, getUserByMail, getUsers, updateUserById } from "../controllers/18_Users.controller.js";

const router = Router();

router.get('/users', [], getUsers); // Obtener todo
router.get('/users/:id', [], getUserById); // Obtener por Id (req.params)
router.get('/users_mail', [], getUserByMail); // Obtener por Mail (req.body)
router.post('/users', [], createUser); // Crear (req.body)
router.put('/users/:id', [], updateUserById); // Editar (req.params y req.body)
router.patch('/users/:id', [], changeStatusById); // Cambiar estado (req.params)
router.delete('/users/:id', [], deleteUserById); // Eliminar (req.params)

export default router;