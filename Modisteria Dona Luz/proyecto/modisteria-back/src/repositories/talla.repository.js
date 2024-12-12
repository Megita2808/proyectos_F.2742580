const { Talla, Pedido, Catalogo } = require("../models");

exports.getAllTallas = async () => {
  return await Talla.findAll();
};

exports.getTallaById = async (id) => {
  return await Talla.findByPk(id);
};

exports.createTalla = async (talla) => {
  return await Talla.create(talla);
};

exports.updateTalla = async (id, talla) => {
  return await Talla.update(talla, { where: { id } });
};

exports.statusTalla = async (id) => {
  return await Talla.update({ estado: false }, { where: { id } });
};

exports.deleteTalla = async (id) => {
  const talla = await Talla.findByPk(id);

  if (!talla) {
    throw new Error("Talla no encontrada");
  }

  const existeEnCatalogoTalla = await Catalogo.findOne({
    include: {
      model: Talla,
      where: { id },
    },
  });
  if (existeEnCatalogoTalla) {
    throw new Error(
      "No se puede eliminar la talla porque está asociado a un catálogo"
    );
  }

  const existeEnPedido = await Pedido.findOne({ where: { tallaId: id } });
  if (existeEnPedido) {
    throw new Error(
      "No se puede eliminar la talla porque está asociado a un pedido"
    );
  }
  return await Talla.destroy({ where: { id } });
};
