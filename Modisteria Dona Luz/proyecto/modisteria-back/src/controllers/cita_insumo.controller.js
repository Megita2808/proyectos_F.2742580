const { statusCita, getCitaById } = require("../repositories/cita.repository");
const { updateVentaAC } = require("../repositories/venta.repository");
const { createCitaInsumo, getInsumoStock, discountInsumo } = require('../repositories/cita_insumo.repository');
const { CitaInsumo, InsumoHistorial } = require("../models");


exports.createAndDiscount = async (req, res) => {
  const { citaId, datosInsumos } = req.body;
  try {
    for (const dataInsumos of datosInsumos) {
      const { insumo_id, cantidad_utilizada } = dataInsumos;
      const insumoStock = await getInsumoStock(insumo_id);
      if (insumoStock < cantidad_utilizada) {
        return res.status(400).json({
          msg: `No hay suficiente stock para el insumo con ID ${insumo_id}. Disponible: ${insumoStock}, Requerido: ${cantidad_utilizada}.`,
        });
      }

      const newCitaInsumos = {
        cita_id: citaId,
        insumo_id: insumo_id,
        cantidad_utilizada: cantidad_utilizada,
      };
      await createCitaInsumo(newCitaInsumos);
      await discountInsumo(insumo_id, cantidad_utilizada);
    }

    // Responder después de procesar todos los insumos correctamente
    res.status(201).json({ msg: "Insumos descontados exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};



exports.endCitaCreateVenta = async (req, res) => {
  const { citaId } = req.body;
  try {
    const cita = await getCitaById(citaId);
    if (!cita) {
      return res.status(404).json({ msg: "Cita no encontrada" });
    }

    await statusCita(citaId, 13); // Actualizar estado de la cita

    const ventaActualizada = await updateVentaAC(citaId, {
      valorFinal: cita.precio,
      estadoId: 14, // Estado Pagado
    });

    // Obtener los insumos utilizados para la cita
    const insumosCita = await CitaInsumo.findAll({ where: { cita_id: citaId } });

    for (const insumo of insumosCita) {
      const { insumo_id, cantidad_utilizada } = insumo;

      // Registrar en historial de insumos
      await InsumoHistorial.create({
        insumo_id,
        cantidad_modificada: -cantidad_utilizada,
        motivo: `Cierre de cita`,
        usuario_id: cita.usuarioId,
        fecha: new Date(),
      });
    }

    res.status(201).json({ msg: "Cita terminada y venta completada." });
  } catch (error) {
    console.error("Error al finalizar la cita y crear venta:", error);
    res.status(500).json({ msg: "Error al finalizar la cita y crear venta", error });
  }
};

