const { Router } = require("express");
const {
  getAllCitas,
  getCitaById,
  crearCita,
  createCita,
  updateCita,
  deleteCita,
  statusCita,
  updateSPT,
  getCitasByUsuarioId,
  aceptarCita,
  cancelarCita,
  cancelCita,
  updateCitaInsumos,
  crearCitaAdmin,
} = require("../controllers/cita.controller");
const { verifyToken } = require("../utils/verifyToken");
const { buscarPermiso } = require("../validators/validations.validator");
const { upload } = require("../utils/image.js");

const router = Router();

router.get("/getAllCitas", getAllCitas);

router.get(
  "/getCitaById/:id",
  [verifyToken, buscarPermiso("Citas")],
  getCitaById
);
router.get(
  "/getCitaByUserId/:usuarioId",
  [verifyToken, buscarPermiso("Citas")],
  getCitasByUsuarioId
);

router.post(
  "/createCita",
  [verifyToken, buscarPermiso("Citas"), upload.single("file")],
  createCita
);
router.post(
  "/crearCita",
  [verifyToken, buscarPermiso("Citas"), upload.single("file")],
  crearCita
);
router.post(
  "/crearCitaAdmin",
  [verifyToken, buscarPermiso("Citas"), upload.single("file")],
  crearCitaAdmin
);

router.put("/updateSPT/:id", updateSPT);
router.put("/updateCitaInsumos/:id", updateCitaInsumos);

router.put("/aceptarCita/:id", upload.single("file"), aceptarCita);
router.put("/cancelarCita/:id", cancelarCita);
router.put("/cancelCita/:id", cancelCita);

router.put(
  "/updateCita/:id",
  [verifyToken, buscarPermiso("Citas"), upload.single("file")],
  updateCita
);

router.put(
  "/statusCita/:id",
  [verifyToken, buscarPermiso("Citas")],
  statusCita
);

router.delete(
  "/deleteCita/:id",
  [verifyToken, buscarPermiso("Citas")],
  deleteCita
);

module.exports = router;
