const { Router } = require("express");
const {
  getAllEstados,
  getEstadoById,
  createEstado,
  updateEstado,
  deleteEstado,
  statusEstado,
} = require("../controllers/estado.controller");
const { verifyToken } = require("../utils/verifyToken");
const { buscarPermiso } = require("../validators/validations.validator");
const router = Router();

router.get("/getAllEstados", [verifyToken], getAllEstados);

router.get(
  "/getEstadoById/:id",
  [verifyToken, buscarPermiso("Estados")],
  getEstadoById
);

router.post(
  "/createEstado",
  [verifyToken, buscarPermiso("Estados")],
  createEstado
);

router.put(
  "/updateEstado/:id",
  [verifyToken, buscarPermiso("Estados")],
  updateEstado
);

router.put(
  "/statusEstado/:id",
  [verifyToken, buscarPermiso("Estados")],
  statusEstado
);

router.delete(
  "/deleteEstado/:id",
  [verifyToken, buscarPermiso("Estados")],
  deleteEstado
);

module.exports = router;
