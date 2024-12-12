const { Router } = require("express");
const {
  getAllTallas,
  getTallaById,
  createTalla,
  updateTalla,
  deleteTalla,
  statusTalla,
} = require("../controllers/talla.controller");
const { verifyToken } = require("../utils/verifyToken");
const { buscarPermiso } = require("../validators/validations.validator");
const router = Router();

router.get("/getAllTallas", [verifyToken], getAllTallas);

router.get(
  "/getTallaById/:id",
  [verifyToken, buscarPermiso("Tallas")],
  getTallaById
);

router.post(
  "/createTalla",
  [verifyToken, buscarPermiso("Tallas")],
  createTalla
);

router.put(
  "/updateTalla/:id",
  [verifyToken, buscarPermiso("Tallas")],
  updateTalla
);

router.put(
  "/statusTalla/:id",
  [verifyToken, buscarPermiso("Tallas")],
  statusTalla
);

router.delete(
  "/deleteTalla/:id",
  [verifyToken, buscarPermiso("Tallas")],
  deleteTalla
);

module.exports = router;
