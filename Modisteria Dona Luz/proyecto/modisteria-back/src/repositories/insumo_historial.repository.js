const {
  InsumoHistorial,
  Insumo,
  Usuario,
  UnidadesDeMedida,
} = require("../models");

exports.getInsumoHistorial = async () => {
  return await InsumoHistorial.findAll({
    include: [
      {
        model: Usuario,
        as: "usuario",
        attributes: ["email", "nombre", "id"],
      },
      {
        model: Insumo,
        as: "insumos",
        attributes: ["nombre", "id"],
        include: {
          model: UnidadesDeMedida,
          as: "unidades_de_medida",
          attributes: ["nombre"],
        },
      },
    ],
    order: [["id", "DESC"]],
  });
};

exports.getInsumoHistorialByInsumoId = async (insumoId) => {
  try {
    const historialByInsumo = await InsumoHistorial.findAll({
      where: {
        insumo_id: insumoId,
      },
      include: [
        {
          model: Insumo,
          as: "insumos",
          attributes: ["nombre", "id"],
        },
        {
          model: Usuario,
          as: "usuario",
          attributes: ["email", "nombre", "id"],
        },
      ],
    });

    if (historialByInsumo.length === 0) {
      return {
        message: `No se encontró historial del insumo con ID ${insumoId}.`,
        status: 404,
      };
    }

    return historialByInsumo;
  } catch (error) {
    console.error("Error al obtener historial del insumo:", error);
    return {
      message: "Error al obtener historial del insumo.",
      status: 500,
      error: error.message,
    };
  }
};
