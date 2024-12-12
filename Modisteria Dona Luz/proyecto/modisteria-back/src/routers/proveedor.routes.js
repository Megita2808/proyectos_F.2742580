const { Router } = require("express");
const { getAllProveedores, getProveedorById, createProveedor, updateProveedor, deleteProveedor } = require("../controllers/proveedor.controller");
const { verifyToken } = require("../utils/verifyToken");
const { buscarPermiso } = require("../validators/validations.validator");
const router = Router();

router.get("/getAllProveedores", getAllProveedores);

router.get("/getProveedorById/:id", getProveedorById);

router.post("/createProveedor", createProveedor);

router.put("/updateProveedor/:id", updateProveedor);

router.delete("/deleteProveedor/:id", deleteProveedor);

module.exports = router;
