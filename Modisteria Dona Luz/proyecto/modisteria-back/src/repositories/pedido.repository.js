const { Pedido, Catalogo, Venta, Talla, Imagen } = require("../models");
const { Op, where } = require("sequelize");

exports.getAllPedido = async () => {
  return await Pedido.findAll();
};

exports.getPedidoById = async (usuarioId, catalogoId, talla) => {
  const whereClause = {
    usuarioId,
  };
  if (catalogoId) {
    whereClause.catalogoId = catalogoId;
  }
  if (talla) {
    whereClause.tallaId = talla;
  }
  return await Pedido.findAll({
    where: whereClause,
    include: [
      {
        model: Catalogo,
        as: "catalogo",
        include: { model: Imagen },
        attributes: ["producto", "precio"],
      },
      { model: Talla },
    ],
  });
};

exports.getPedidoByUsuarioyEstado = async (id) => {
  return await Pedido.findAll({ estado: 3 }, { where: { id } });
};

exports.getCatalogoIdByVentaId = async (ventaId) => {
  return await Pedido.findOne({
    where: { ventaId },
  });
};

exports.getPedidoByVentaId = async (ventaId) => {
  return await Pedido.findOne({
    where: { ventaId },
  });
};


exports.getUsuarioIdByPedidoId = async (id) => {
  return await Pedido.findOne({
    where: { id },
    attributes: ["usuarioId"]
  });
};


exports.getPedidoByVenta = async (idVenta) => {
  return await Pedido.findAll({ estado: 3 }, { where: { ventaId: idVenta } });
};

exports.createPedido = async (pedido) => {
  return await Pedido.create(pedido);
};

exports.updatePedido = async (idPedido, pedido) => {
  return await Pedido.update(pedido, { where: { idPedido } });
};

exports.statusPedido = async (id) => {
  return await Pedido.update({ estado: false }, { where: { id } });
};

exports.deletePedido = async (id) => {
  const pedido = await Pedido.findOne({ where: { idPedido: id } });

  if (!pedido) {
    throw new Error("Pedido no encontrado");
  }

  // const existeEnCotizacionPedidos = await CotizacionPedidos.findOne({ where: { pedidoId: pedido.id } });
  // const existeCatalogo = await Pedido.findOne({ where: { id: pedido.catalogoId } });

  // if (existeEnCotizacionPedidos || existeCatalogo) {
  //     throw new Error("No se puede eliminar el pedido porque está asociado a registros en otras tablas");
  // }

  return await Pedido.destroy({ where: { idPedido: id } });
};
