const { Router } = require("express");
const {
  getAllUnidadDeMedidas,
  getUnidadDeMedidaById,
  createUnidadDeMedida,
  updateUnidadDeMedida,
  deleteUnidadDeMedida
} = require("../controllers/unidades_de_medida.controller");
const { verifyToken } = require("../utils/verifyToken");
const { buscarPermiso } = require("../validators/validations.validator");
const router = Router();

router.get("/getAllUnidadDeMedidas", getAllUnidadDeMedidas);

router.get(
  "/getUnidadDeMedidaById/:id",
  [verifyToken, buscarPermiso("Unidades De Medida")],
  getUnidadDeMedidaById
);

router.post(
  "/createUnidadDeMedida",
  [verifyToken, buscarPermiso("Unidades De Medida")],
  createUnidadDeMedida
);

router.put(
  "/updateUnidadDeMedida/:id",
  [verifyToken, buscarPermiso("Unidades De Medida")],
  updateUnidadDeMedida
);

router.delete(
  "/deleteUnidadDeMedida/:id",
  [verifyToken, buscarPermiso("Unidades De Medida")],
  deleteUnidadDeMedida
);

module.exports = router;
