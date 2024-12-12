const { Router } = require("express");
const { ftCatalogo } = require("../controllers/ficha.controller");
const {
  createCatalogoInsumos,
} = require("../controllers/catalogo_insumo.contoller");
const router = Router();

router.post("/createCatIns", createCatalogoInsumos);
router.get("/getFTCatalogo", ftCatalogo);

module.exports = router;
