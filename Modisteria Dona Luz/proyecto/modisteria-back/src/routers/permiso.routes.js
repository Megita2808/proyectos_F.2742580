const { Router } = require("express");
const {
  getAllPermisos,
  getPermisoById,
  createPermiso,
  updatePermiso,
  deletePermiso,
  statusPermiso,
} = require("../controllers/permiso.controller");
const { verifyToken } = require("../utils/verifyToken");
const { buscarPermiso } = require("../validators/validations.validator");
const router = Router();

router.get("/getAllPermisos", [verifyToken], getAllPermisos);

router.get(
  "/getPermisoById/:id",
  [verifyToken, buscarPermiso("Permisos")],
  getPermisoById
);

router.post(
  "/createPermiso",
  // [verifyToken, buscarPermiso("Permisos")],
  createPermiso
);

router.put(
  "/updatePermiso/:id",
  [verifyToken, buscarPermiso("Permisos")],
  updatePermiso
);

router.put(
  "/statusPermiso/:id",
  [verifyToken, buscarPermiso("Permisos")],
  statusPermiso
);

router.delete(
  "/deletePermiso/:id",
  [verifyToken, buscarPermiso("Permisos")],
  deletePermiso
);

module.exports = router;
