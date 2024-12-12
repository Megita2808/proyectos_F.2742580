const { Router } = require("express");
const {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  statusRole,
} = require("../controllers/role.controller");
const { buscarPermiso } = require("../validators/validations.validator");
const { verifyToken } = require("../utils/verifyToken");
const router = Router();

router.get("/getAllRoles", [verifyToken], getAllRoles);

router.get(
  "/getRolById/:id",
  [verifyToken, buscarPermiso("Roles")],
  getRoleById
);

router.post("/createRol", [verifyToken, buscarPermiso("Roles")], createRole);

router.put("/updateRol/:id", [verifyToken, buscarPermiso("Roles")], updateRole);

router.put("/statusRol/:id", [verifyToken, buscarPermiso("Roles")], statusRole);

router.delete(
  "/deleteRol/:id",
  [verifyToken, buscarPermiso("Roles")],
  deleteRole
);

module.exports = router;
