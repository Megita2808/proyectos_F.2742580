const {
  Insumo,
  Categoria,
  CatalogoInsumos,
  CitaInsumo,
  UnidadesDeMedida,
  CategoriaInsumos,
} = require("../models");
const { Sequelize } = require("sequelize");

exports.getAllInsumos = async (type) => {
  const whereClause = {};
  if (type) whereClause.tipo = type;
  return await Insumo.findAll({
    where: whereClause,
    include: [
      {
        model: UnidadesDeMedida,
        as: "unidades_de_medida",
        attributes: ["nombre"],
      },
      {
        model: CategoriaInsumos,
        as: "categoria_insumos",
        attributes: ["tipo", "nombre"],
      },
    ],
  });
};

exports.getInsumoById = async (id) => {
  return await Insumo.findByPk(id);
};

exports.createInsumo = async (insumo) => {
  return await Insumo.create(insumo);
};

exports.reponerInsumo = async (id) => {
  return await Insumo.update({ cantidad: 0 }, { where: { id } });
};

exports.updateInsumo = async (id, insumo) => {
  return await Insumo.update(insumo, { where: { id } });
};

exports.cantidadInsumos = async (id, cantidad) => {
  return await Insumo.update(
    { cantidad: Sequelize.literal(`cantidad + ${cantidad}`) },
    { where: { id: id } }
  );
};

exports.statusInsumo = async (id) => {
  return await Insumo.update({ estado: false }, { where: { id } });
};

exports.deleteInsumo = async (id) => {
  const insumo = await Insumo.findByPk(id);

  if (!insumo) {
    throw new Error("Insumo no encontrado");
  }

  const isInsumoBeingUsedOnCatalogo = await CatalogoInsumos.findOne({
    where: { insumo_id: id },
  });
  const isInsumoBeingUsedOnCita = await CitaInsumo.findOne({
    where: { insumo_id: id },
  });

  if (isInsumoBeingUsedOnCatalogo) {
    throw new Error(
      "¡No se puede eliminar el insumo porque está asociado a una prenda del catálogo!"
    );
  }
  if (isInsumoBeingUsedOnCita) {
    throw new Error(
      "¡No se puede eliminar el insumo porque está asociado a una cita!"
    );
  }

  // if (insumo.estadoId === 2) {
  return await Insumo.destroy({ where: { id } });
  // }
  // else {
  //     throw new Error("No se puede eliminar el insumo porque está activo");
  // }
};

exports.getInsumosByCategoria = async (categoriaId) => {
  return await Insumo.findAll({
    where: { categoriaId },
    include: [{ model: Categoria, as: "categorias", attributes: ["nombre"] }],
  });
};
