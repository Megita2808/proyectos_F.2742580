const MedidaProducto = require('../../../modules/Catalogo/medidaProducto');
const MedidaVenta = require('../../../modules/Catalogo/medidaVenta');
const Peso = require('../../../modules/Catalogo/peso');
const Compra = require('../../../modules/compra/compraModule');
const UnidadMedida = require('../../../modules/unidadMedida/UnidadesMedidaModulo');
const Venta = require('../../../modules/venta/ventaModule');

const pesosGet = async (req, res) => {
  try {
      const pesos = await Peso.find().populate('unidadMedida');
      
      res.json({
        pesos, 
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al obtener los colores' });
  }
};

const pesoUnicoGet = async (req, res) => {
  const { id_Peso } = req.params;
  try {
      const peso = await Peso.findOne({ Categoria: id_Peso })
          .select('peso estado');
      
      res.json(peso);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

const pesoPost = async (req, res) => {
  const { peso, unidadMedida } = req.body;

  try {
    const pesoExistente = await Peso.findOne({ peso, unidadMedida });

    if (pesoExistente) {
      return res.status(400).json({ msg: 'Ya existe un peso registrado para esta unidad de medida' });
    }

    const pesoCreado = new Peso({
      peso,
      unidadMedida
    });

    await pesoCreado.save();
    res.json({ msg: 'Peso registrado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al registrar el peso', error: error.message });
  }
};

const pesoPut = async (req, res) => {
  const { id_Peso } = req.params;
  const { peso, unidadMedida } = req.body;

  try {
    if (!id_Peso || !peso || !unidadMedida) {
      return res.status(400).json({ msg: 'Por favor, proporcione los datos completos' });
    }

    const pesoExistente = await Peso.findOne({
      _id: { $ne: id_Peso },
      peso,
      unidadMedida,
    });

    if (pesoExistente) {
      return res.status(400).json({ msg: 'Ya existe un peso registrado para esta unidad de medida' });
    }

    const pesoActualizado = await Peso.findByIdAndUpdate(id_Peso, { peso, unidadMedida }, { new: true });

    if (!pesoActualizado) {
      return res.status(404).json({ msg: 'Peso no encontrado' });
    }

    res.json({ msg: 'Peso actualizado exitosamente', peso: pesoActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor al actualizar el peso', error: error.message });
  }
};

const pesoDelete = async (req, res = response) => {
  try {
      const { id_Peso } = req.params;

      const existeEnMedidaProducto = await MedidaProducto.findOne({ "peso.valores.valor" : id_Peso });
      
      if (existeEnMedidaProducto) {
        return res.status(400).json({ msg: 'El peso no puede ser eliminada porque está asociada a una medida producto.' });
      }else{
        const existeEnMedidaVenta = await MedidaVenta.findOne({ "peso.valores.valor" : id_Peso });
        if (existeEnMedidaVenta) {
          return res.status(400).json({ msg: 'El peso no puede ser eliminada porque está asociada a una medida venta.' });
        }else{
          const existeEnVenta = await Venta.findOne({ "detalleVenta.medidasProducto.peso" : id_Peso });
          if (existeEnVenta) {
            return res.status(400).json({ msg: 'La medida no puede ser eliminado porque está asociado a una o más ventas.' });
          }else{
            const existeEnVenta2 = await Venta.findOne({ "detalleVenta.medidasVenta.peso" : id_Peso });
            if (existeEnVenta2) {
              return res.status(400).json({ msg: 'La medida no puede ser eliminado porque está asociado a una o más ventas.' });
            }
          }
        }
      }
  
      const pesoActualizado = await Peso.findOneAndDelete({ _id: id_Peso });

      if (!pesoActualizado) {
          return res.status(404).json({ msg: 'Peso no encontrado' });
      }

      res.json({ msg: 'Peso eliminada exitosamente'});
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error en el servidor al eliminar el peso' });
  }
};

const pesoActualizarEstado = async (req, res) => {
    try {
      const { id_Peso } = req.params;
      const { estado } = req.body;
      
      if (typeof estado !== 'boolean') {
        return res.status(400).json({ mensaje: 'El estado debe ser un valor booleano.' });
      }
  
      const color = await Peso.findByIdAndUpdate(
        id_Peso,
        { estado },
        { new: true }
      );
  
      if (!color) {
        return res.status(404).json({ mensaje: 'Peso no encontrada.' });
      }
  
      res.json({ estado: color.estado });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar el estado del peso.'});
    }
};

module.exports = {
  pesosGet,
  pesoUnicoGet,
  pesoPost,
  pesoPut,
  pesoDelete,
  pesoActualizarEstado,
};