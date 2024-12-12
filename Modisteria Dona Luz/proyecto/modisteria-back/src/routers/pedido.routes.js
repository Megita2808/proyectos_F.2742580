const { Router } = require("express");
const {
  getAllPedido,
  getPedidoById,
  createPedido,
  updatePedido,
  deletePedido,
} = require("../controllers/pedido.controller.js");
const { verifyToken } = require("../utils/verifyToken.js");
const { buscarPermiso } = require("../validators/validations.validator.js");
const router = Router();

router.get("/getAllPedido", [verifyToken], getAllPedido);

router.get(
  "/getPedidoById/:id",
  [verifyToken, buscarPermiso("Pedidos")],
  getPedidoById
);

router.post(
  "/createPedido",
  [verifyToken, buscarPermiso("Pedidos")],
  createPedido
);

router.put(
  "/updatePedido/:idPedido",
  [verifyToken, buscarPermiso("Pedidos")],
  updatePedido
);

router.delete(
  "/deletePedido/:id",
  [verifyToken, buscarPermiso("Pedidos")],
  deletePedido
);

module.exports = router;
