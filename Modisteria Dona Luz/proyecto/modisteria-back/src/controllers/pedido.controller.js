const { getCatalogoById } = require("../repositories/catalogo.repository.js");
const {
  getAllPedido,
  getPedidoById,
  createPedido,
  updatePedido,
  deletePedido,
} = require("../repositories/pedido.repository.js");

exports.getAllPedido = async (req, res) => {
  try {
    const pedidos = await getAllPedido();
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPedidoById = async (req, res) => {
  const { id } = req.params;
  const catalogoId = req.query.catalogoId;
  const tallaId = req.query.tallaId;
  try {
    const Pedido = await getPedidoById(id, catalogoId, tallaId);
    res.status(200).json(Pedido);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createPedido = async (req, res) => {
  const { idPedido, cantidad, tallaId, catalogoId } = req.body;
  try {
    const catalogo = await getCatalogoById(catalogoId);

    const newPedido = {
      idPedido,
      cantidad,
      valorUnitario: catalogo.precio,
      tallaId,
      usuarioId: req.id,
      catalogoId,
      ventaId: null,
      estadoId: 3,
    };

    const pedido = await createPedido(newPedido);
    res.status(201).json({ msg: "Pedido creado exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.updatePedido = async (req, res) => {
  const { idPedido } = req.params;
  const Pedido = req.body;

  try {
    await updatePedido(idPedido, Pedido);
    res.status(201).json({ msg: "Pedido actualizado exitosamente" });
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.statusPedido = async (req, res) => {
  const { id } = req.params;
  try {
    await statusPedido(id);
    res.status(201).json({ msg: "Pedido inactivo" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.deletePedido = async (req, res) => {
  const { id } = req.params;
  try {
    await deletePedido(id);
    res.status(201).json({ msg: "Pedido eliminado" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
