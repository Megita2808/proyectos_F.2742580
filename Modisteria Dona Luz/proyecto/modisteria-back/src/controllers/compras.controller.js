const {
  getAllCompras,
  getCompraById,
  createCompra,
} = require("../repositories/compras.repository");
const { createCompraInsumo } = require("../repositories/compra_insumo.repository")
const { Insumo, Compras, CompraInsumos } = require("../models");
exports.getAllCompras = async (req, res) => {
  try {
    const compras = await getAllCompras();
    res.status(200).json(compras);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.getCompraById = async (req, res) => {
  const { id } = req.params;

  try {
    const compra = await getCompraById(id);
    res.status(200).json(compra);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.createCompra = async (req, res) => {
  const { compras } = req.body;

  try {
    if (!Array.isArray(compras) || compras.length === 0) {
      throw new Error("Se debe proporcionar al menos una compra.");
    }
    let valorTotalCompra = 0;
    const { proveedorId } = compras[0];

    const compra = await createCompra({
      fecha: new Date(),
      proveedorId,
      valorTotal: 0,
    });
    const compraId = compra.id;

    for (const compraData of compras) {
      const { cantidad, valor, insumoId } = compraData;

      const insumo = await Insumo.findByPk(insumoId);
      if (!insumo) {
        throw new Error(`El insumo con el ID ${insumoId} no existe.`);
      }

      insumo.cantidad += cantidad;
      await insumo.save();
      await createCompraInsumo({
        compra_id: compraId,
        insumo_id: insumoId,
        cantidad,
        precio: valor,
      });
      valorTotalCompra += valor;
    }
    compra.valorTotal = valorTotalCompra;
    await compra.save();

    res.status(201).json({
      msg: "Compra registrada exitosamente",
      compra
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

