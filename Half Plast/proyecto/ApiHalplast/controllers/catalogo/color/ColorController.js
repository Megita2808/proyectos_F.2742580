const Color = require('../../../modules/Catalogo/color');
const PrecioVenta = require('../../../modules/precioVenta/PrecioVentaModulo');

const coloresGet = async (req, res) => {
  try {
      const { q, nombre, page = 1, limit } = req.query; 
      
      const colores = await Color.find()
          .select('nombreColor estado');

      res.json({
        colores, 
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al obtener los colores' });
  }
};

const colorUnicoGet = async (req, res) => {
  const { id_Color } = req.params;
  try {
      const color = await Color.findOne({ Categoria: id_Color })
          .select('nombreColor estado');
      
      res.json(color);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

const colorPost = async (req, res) => {
  const { nombreColor } = req.body;

  const color = new Color({
    nombreColor
  });

  try {
      await color.save();
      res.json({ msg: "Color registrado correctamente" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error al registrar el color" });
  }
};

const colorPut = async (req, res) => {
  try {
    const { id_Color } = req.params;
    const { nombreColor } = req.body;

    if (!id_Color || !nombreColor) {
      return res.status(400).json({ msg: 'Por favor, proporcione los datos completos' });
    }

    const formattedNombreColor = nombreColor
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());

    const colorActual = await Color.findById(id_Color);
    if (!colorActual) {
      return res.status(404).json({ msg: 'Color no encontrado' });
    }

    if (colorActual.nombreColor !== formattedNombreColor) {
      const colorExiste = await Color.findOne({
        nombreColor: formattedNombreColor,
        _id: { $ne: id_Color },
      });

      if (colorExiste) {
        return res.status(401).json({ msg: 'Ya existe un color con ese nombre' });
      }
    }

    const color = await Color.findOneAndUpdate(
      { _id: id_Color },
      { nombreColor: formattedNombreColor },
      { new: true }
    );

    if (!color) {
      return res.status(404).json({ msg: 'Color no encontrado' });
    }

    res.status(200).json({ msg: 'Color actualizado exitosamente', color });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor al actualizar el color', error: error.message });
  }
};

const colorDelete = async (req, res = response) => {
  try {
      const { id_Color } = req.params;

      const existeEnPrecioVenta = await PrecioVenta.findOne({ "color" : id_Color });
      
      if (existeEnPrecioVenta) {
        return res.status(400).json({ msg: 'El color no puede ser eliminada porque está asociada a un precio venta.' });
      }

      const color = await Color.findOneAndDelete({ _id: id_Color });

      if (!color) {
          return res.status(404).json({ msg: 'Color no encontrado' });
      }

      res.json({ msg: 'Color eliminada exitosamente'});
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error en el servidor al eliminar el color' });
  }
};

const colorActualizarEstado = async (req, res) => {
    try {
      const { id_Color } = req.params;
      const { estado } = req.body;
      
      if (typeof estado !== 'boolean') {
        return res.status(400).json({ mensaje: 'El estado debe ser un valor booleano.' });
      }
  
      const color = await Color.findByIdAndUpdate(
        id_Color,
        { estado },
        { new: true }
      );
  
      if (!color) {
        return res.status(404).json({ mensaje: 'Color no encontrada.' });
      }
  
      res.json({ estado: color.estado });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar el estado del color.'});
    }
  };

module.exports = {
  coloresGet,
  colorUnicoGet,
  colorPost,
  colorPut,
  colorDelete,
  colorActualizarEstado,
};