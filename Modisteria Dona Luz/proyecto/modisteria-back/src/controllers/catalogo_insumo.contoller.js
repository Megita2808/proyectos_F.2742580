const {
  createCatIns,
} = require("../repositories/catalogo_insumos.repository.js");

exports.createCatalogoInsumos = async (req, res) => {
  const { catalogoId, datosInsumos } = req.body;
  try {
    for (const dataInsumos of datosInsumos) {
      const { insumo_id, cantidad_utilizada } = dataInsumos;
      const newCatIns = {
        catalogo_id: catalogoId,
        insumo_id: insumo_id,
        cantidad_utilizada: cantidad_utilizada,
      };

      await createCatIns(newCatIns);
    }
    res.status(201).json({ msg: "Creación exitosa" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
