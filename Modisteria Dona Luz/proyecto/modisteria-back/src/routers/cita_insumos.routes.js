const { Router } = require("express");
const { createAndDiscount, endCitaCreateVenta } = require("../controllers/cita_insumo.controller");
const { ftCita } = require("../controllers/ficha.controller");
const router = Router();

router.post('/createAndDiscount', createAndDiscount);
router.put('/endCitaCreateVenta', endCitaCreateVenta);

router.get('/getCitas', ftCita)

module.exports = router;