const { Router } = require("express");
const {
  getAllDomicilios,
  getDomicilioById,
  getDomiciliosByDomiciliario,
  getDomiciliosByClienteId,
  createDomicilio,
  updateDomicilio,
  updateSG,
  clienteDomicilio,
  statusDomicilio
} = require("../controllers/domicilio.controller");
const { verifyToken } = require("../utils/verifyToken");
const { buscarPermiso } = require("../validators/validations.validator");
const router = Router();

router.get("/getAllDomicilios", getAllDomicilios);

router.get(
  "/getDomicilioById/:id",
  [verifyToken, buscarPermiso("Domicilios")],
  getDomicilioById
);

router.get(
  "/getDomiciliosByClienteId/:id",
  [verifyToken, buscarPermiso("Domicilios")],
  getDomiciliosByClienteId
);

/* router.post(
  "/createDomicilio",

  createDomicilio
);
 */
router.put(
  "/updateDomicilio/:id",
  [verifyToken, buscarPermiso("Domicilios")],
  updateDomicilio
);

router.put("/updateSG/:id", updateSG)
router.put("/clienteDomicilio/:id", clienteDomicilio)
router.put("/statusDomicilio/:id", statusDomicilio)


module.exports = router;
