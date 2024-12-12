const { Router } = require("express");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  statusUser,
  deleteUser,
  login,
  forgotPassword,
  resetPassword,
  getCodePassword,
  getCodeVerification,
  verifyUser,
  isYourCurrentPassword,
  resetCurrentPassword,
  updateInfo,
  createUsuario,
  sendEmail,
} = require("../controllers/usuario.controller");
const { verifyToken } = require("../utils/verifyToken");
const { buscarPermiso } = require("../validators/validations.validator");
const router = Router();

router.get("/getAllUsers", [verifyToken], getAllUsers);

router.get(
  "/getUserById/:id",
  [verifyToken, buscarPermiso("Usuarios")],
  getUserById
);

router.post("/createUser", [], createUser);
router.post(
  "/createUsuario",
  [verifyToken, buscarPermiso("Usuarios")],
  createUsuario
);

router.post("/getCodeVerification", [], getCodeVerification);

router.post("/verifyUser", [], verifyUser);

router.put(
  "/updateUser/:id",
  [verifyToken, buscarPermiso("Usuarios")],
  updateUser
);
router.put("/updateInfo/:id", [verifyToken], updateInfo);

router.put(
  "/statusUser/:id",
  [verifyToken, buscarPermiso("Usuarios")],
  statusUser
);

router.delete(
  "/deleteUser/:id",
  [verifyToken, buscarPermiso("Usuarios")],
  deleteUser
);

router.post("/getCodePass", [], getCodePassword);

router.post("/login", [], login);

router.post("/forgotPassword", [], forgotPassword);

router.post("/resetPassword", [], resetPassword);
router.post("/sendEmail", [], sendEmail);
router.post("/isYourCurrentPassword", [], isYourCurrentPassword);
router.post("/resetCurrentPassword", [verifyToken], resetCurrentPassword);

module.exports = router;
