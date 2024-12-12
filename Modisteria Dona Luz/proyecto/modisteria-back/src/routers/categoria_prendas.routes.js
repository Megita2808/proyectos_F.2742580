const { Router } = require("express");
const {
  getAllCategoriaPrendas,
  getCategoriaPrendaById,
  createCategoriaPrenda,
  updateCategoriaPrenda,
  deleteCategoriaPrenda,
  statusCategoriaPrenda,
  // descargarMolde
} = require("../controllers/categoria_prendas.controller");
const { verifyToken } = require("../utils/verifyToken");
const { buscarPermiso } = require("../validators/validations.validator");
const router = Router();
const { upload, gestionPDF } = require('../utils/pdf.js'); 

router.get("/getAllCategoriaPrendas", getAllCategoriaPrendas);

router.get(
  "/getCategoriaPrendaById/:id",
  [verifyToken, buscarPermiso("Categoría Prenda")],
  getCategoriaPrendaById
);

router.post(
  "/createCategoriaPrenda",
  [verifyToken, buscarPermiso("Categoría Prenda"), upload.single('molde'), gestionPDF],
  createCategoriaPrenda
);

router.put(
  "/updateCategoriaPrenda/:id",
  [verifyToken, buscarPermiso("Categoría Prenda"), upload.single('molde'), gestionPDF],
  updateCategoriaPrenda
);


router.put(
  "/statusCategoriaPrenda/:id",
  [verifyToken, buscarPermiso("Categoría Prenda")],
  statusCategoriaPrenda
);

router.delete(
  "/deleteCategoriaPrenda/:id",
  [verifyToken, buscarPermiso("Categoría Prenda")],
  deleteCategoriaPrenda
);

module.exports = router;
