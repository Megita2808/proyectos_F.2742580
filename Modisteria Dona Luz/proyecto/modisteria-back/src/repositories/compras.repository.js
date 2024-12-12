const { Compras, Insumo, Proveedor, UnidadesDeMedida } = require("../models");

exports.getAllCompras = async () => {
  return await Compras.findAll({
    include: [
      {
        model: Insumo,
        as: "insumos",
        attributes: ["nombre", "cantidad"],
        include: {
          model: UnidadesDeMedida,
          as: "unidades_de_medida",
          attributes: ["nombre"],
        },
      },
      {
        model: Proveedor,
        as: "proveedor",
        attributes: ["nombre", "telefono"],
      },
    ],
    order: [["id", "DESC"]],
  });
};

exports.getCompraById = async (id) => {
  return await Compras.findByPk(id);
};

exports.createCompra = async (compra) => {
  return await Compras.create(compra);
};
