const { Compras, Insumo, CompraInsumos } = require("../models")

exports.createCompraInsumo = async (compraInsumos) => {
    return await CompraInsumos.create(compraInsumos);
};