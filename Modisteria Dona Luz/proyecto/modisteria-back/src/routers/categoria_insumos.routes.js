const { Router } = require("express");
const {
  getAllCategoriaInsumos,
  getCategoriaInsumoById,
  createCategoriaInsumo,
  updateCategoriaInsumo,
  deleteCategoriaInsumo,
  statusCategoriaInsumo,
  getCategoriaInsumoByTipo,
} = require("../controllers/categoria_insumos.controller");
const { verifyToken } = require("../utils/verifyToken");
const { buscarPermiso } = require("../validators/validations.validator");
const router = Router();

router.get("/getAllCategoriaInsumos", getAllCategoriaInsumos);

router.get(
  "/getCategoriaInsumoById/:id",
  [verifyToken, buscarPermiso("Categoría Insumo")],
  getCategoriaInsumoById
);

router.get(
  "/getCategoriaInsumoByTipo/:tipo",
  [verifyToken, buscarPermiso("Categoría Insumo")],
  getCategoriaInsumoByTipo
);

router.post(
  "/createCategoriaInsumo",
  [verifyToken, buscarPermiso("Categoría Insumo")],
  createCategoriaInsumo
);

router.put(
  "/updateCategoriaInsumo/:id",
  [verifyToken, buscarPermiso("Categoría Insumo")],
  updateCategoriaInsumo
);

router.put(
  "/statusCategoriaInsumo/:id",
  [verifyToken, buscarPermiso("Categoría Insumo")],
  statusCategoriaInsumo
);

router.delete(
  "/deleteCategoriaInsumo/:id",

  deleteCategoriaInsumo
);

module.exports = router;
