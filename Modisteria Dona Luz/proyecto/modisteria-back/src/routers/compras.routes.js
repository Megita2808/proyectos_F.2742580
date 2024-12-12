const { Router } = require("express");
const { getAllCompras, getCompraById, createCompra, } = require("../controllers/compras.controller");
const { verifyToken } = require("../utils/verifyToken");
const { buscarPermiso } = require("../validators/validations.validator");
const router = Router();

router.get("/getAllCompras", getAllCompras);

router.get("/getCompraById/:id", getCompraById);

router.post("/createCompra", createCompra);


module.exports = router;
 