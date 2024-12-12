const { UnidadesDeMedida, Insumo } = require("../models");

exports.getAllUnidadDeMedidas = async () => {
  return await UnidadesDeMedida.findAll();
};

exports.getUnidadDeMedidaById = async (id) => {
  return await UnidadesDeMedida.findByPk(id);
};

exports.createUnidadDeMedida = async (unidadDeMedida) => {
  return await UnidadesDeMedida.create(unidadDeMedida);
};

exports.updateUnidadDeMedida = async (id, unidadDeMedida) => {
  return await UnidadesDeMedida.update(unidadDeMedida, { where: { id } });
};

exports.deleteUnidadDeMedida = async (id) => {
  const unidadDeMedida = await UnidadesDeMedida.findByPk(id);

  if (!unidadDeMedida) {
    throw new Error("Unidad de medida no encontrada");
  }
  const isunidadDeMedidaBeingUsedOnInsumos = await Insumo.findOne({
    where: { unidadMedidaId: id },
  });
  if (isunidadDeMedidaBeingUsedOnInsumos) {
    throw new Error(
      "¡No se puede eliminar la unidad de medida porque está asociada a un insumo!"
    );
  }
  
  return await UnidadesDeMedida.destroy({ where: { id } });
};
