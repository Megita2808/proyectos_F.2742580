const { Router } = require("express");
const {
  getAllCatalogo,
  getCatalogoById,
  createCatalogo,
  updateCatalogo,
  deleteCatalogo,
  statusCatalogo,
  getCatalogoByCategoria,
  getAllCatalogoDashboard,
} = require("../controllers/catalogo.controller");
const { upload } = require("../utils/image.js");
const { verifyToken } = require("../utils/verifyToken.js");
const { buscarPermiso } = require("../validators/validations.validator.js");

const router = Router();

router.get("/getAllCatalogo", getAllCatalogo);
router.get("/getAllCatalogoDash", getAllCatalogoDashboard);

router.get(
  "/getCatalogoById/:id",
  [verifyToken, buscarPermiso("Catálogo")],
  getCatalogoById
);

router.get(
  "/getCatalogoByCategoria/:categoriaId",
  [verifyToken, buscarPermiso("Catálogo")],
  getCatalogoByCategoria
);

router.post(
  "/createCatalogo",
  [verifyToken, buscarPermiso("Catálogo"), upload.array("file", 5)],
  createCatalogo
);

router.put(
  "/updateCatalogo/:id",
  [verifyToken, buscarPermiso("Catálogo"), upload.array("file", 5)],
  updateCatalogo
);

router.put(
  "/statusCatalogo/:id",
  [verifyToken, buscarPermiso("Catálogo")],
  statusCatalogo
);

router.delete(
  "/deleteCatalogo/:id",
  [verifyToken, buscarPermiso("Catálogo")],
  deleteCatalogo
);

module.exports = router;
