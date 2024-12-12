const { Insumo, InsumoHistorial } = require("../models");
const {
  getAllInsumos,
  getInsumoById,
  createInsumo,
  updateInsumo,
  deleteInsumo,
  getInsumosByCategoria,
  cantidadInsumos,
  reponerInsumo,
} = require("../repositories/insumo.repository");
const { Sequelize } = require("sequelize");

exports.getAllInsumos = async (req, res) => {
  try {
    const { tipo } = req.query;
    const insumos = await getAllInsumos(tipo);
    res.status(200).json(insumos);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.getInsumosByCategoria = async (req, res) => {
  const { categoriaId } = req.params;
  try {
    const insumos = await getInsumosByCategoria(categoriaId);
    if (insumos.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron insumos para esta categoría" });
    }
    res.status(200).json(insumos);
  } catch (error) {
    console.error("Error al obtener insumos:", error);
    res
      .status(400)
      .json({ error: "Error al obtener los insumos", details: error.message });
  }
};

exports.reponerInsumo = async (req, res) => {
  const { id } = req.body;
  try {
    await reponerInsumo(id);
    res.status(201).json({ msg: "Reposición de insumos realizada." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

exports.getInsumoById = async (req, res) => {
  const { id } = req.params;

  try {
    const insumo = await getInsumoById(id);
    res.status(200).json(insumo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createInsumo = async (req, res) => {
  const { nombre, categoriaInsumoId, unidadMedidaId, estadoId, cantidad } = req.body;
  try {
    const insumo = {
      nombre,
      cantidad,
      categoriaInsumoId,
      unidadMedidaId,
      estadoId
    }
    console.log(req.body);
    await createInsumo(insumo);
    res.status(201).json({ msg: "Insumo creado exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateInsumo = async (req, res) => {
  const { id } = req.params;
  const insumo = req.body;
  try {
    await updateInsumo(id, insumo);
    res.status(201).json({ msg: "Insumo actualizado exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.cantidadInsumos = async (req, res) => {
  const { insumos, usuario_id } = req.body;
  const errors = [];

  try {
    for (let ins of insumos) {
      const { id, cantidad, motivo } = ins;

      const insumo = await Insumo.findByPk(id);
      if (cantidad < 0) {
        const cantidadInsumo = insumo.cantidad;
        const total = cantidadInsumo + cantidad;

        if (total < 0) {
          errors.push(
            `El insumo "${insumo.nombre}" no puede quedar con cantidad menor a 0.`
          );
        }
      }

      if (!motivo || motivo.trim() === "") {
        errors.push(
          `Es obligatorio proporcionar una justificación para el cambio en el insumo "${insumo.nombre}".`
        );
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    for (let ins of insumos) {
      const { id, cantidad, motivo } = ins;

      await Insumo.update(
        { cantidad: Sequelize.literal(`cantidad + ${cantidad}`) },
        { where: { id: id } }
      );

      await InsumoHistorial.create({
        insumo_id: id,
        cantidad_modificada: cantidad,
        motivo: motivo,
        usuario_id: usuario_id,
        fecha: new Date(),
      });
    }

    res
      .status(201)
      .json({ message: "Cantidad e historial actualizados correctamente." });
  } catch (error) {
    console.error("Error al actualizar cantidad de insumos:", error);
    res.status(500).json({ error: "Error al actualizar cantidad de insumos." });
  }
};

exports.statusInsumo = async (req, res) => {
  const { id } = req.params;

  try {
    await statusInsumo(id);
    res.status(201).json({ msg: "Insumo inactivo" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.deleteInsumo = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteInsumo(id);
    res.status(201).json({ msg: "Insumo eliminado" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
