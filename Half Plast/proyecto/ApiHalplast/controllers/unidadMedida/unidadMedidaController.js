const { response } = require("express");
const UnidadMedida = require('../../modules/unidadMedida/UnidadesMedidaModulo');

const unidadesMedidaGet = async (req, res = response) => {
    try {
        const unidadesMedida = await UnidadMedida.find();
        res.json({
            unidadesMedida
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener las unidades de medida' });
    }
};

const unidadesMedidaPost = async (req, res = response) => {
    const { nombre, simbolo, tipo } = req.body;
    const nuevaUnidadMedida = new UnidadMedida({ nombre, simbolo, tipo });
    try {
        await nuevaUnidadMedida.save();
        res.json({ msg: 'Unidad de medida registrada correctamente', nuevaUnidadMedida });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al registrar la unidad de medida' });
    }
};

const unidadesMedidaPut = async (req, res = response) => {
    const { id } = req.params;
    const { nombre, simbolo, tipo } = req.body;
    
    try {
        const unidadMedida = await UnidadMedida.findByIdAndUpdate(
            id,
            { nombre, simbolo, tipo },
            { new: true }
        );
        
        if (!unidadMedida) {
            return res.status(404).json({ msg: 'Unidad de medida no encontrada' });
        }

        res.json({ msg: 'Unidad de medida actualizada correctamente', unidadMedida });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar la unidad de medida' });
    }
};

const unidadesMedidaDelete = async (req, res = response) => {
    const { id } = req.params;

    try {
        const unidadMedida = await UnidadMedida.findByIdAndDelete(id);
        if (!unidadMedida) {
            return res.status(404).json({ msg: 'Unidad de medida no encontrada' });
        }

        res.json({ msg: 'Unidad de medida eliminada exitosamente', unidadMedida });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar la unidad de medida' });
    }
};

const unidadMedidaGetById = async (req, res = response) => {
    const { id } = req.params;

    try {
        const unidadMedida = await UnidadMedida.findById(id);
        if (!unidadMedida) {
            return res.status(404).json({ msg: 'Unidad de medida no encontrada' });
        }

        res.json(unidadMedida);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener la unidad de medida' });
    }
};

const unidadesMedidaGetByTipo = async (req, res = response) => {
    const { tipo } = req.params;
  
    try {
      const tiposValidos = ['peso', 'longitud'];
      if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({ msg: `El tipo '${tipo}' no es válido. Los tipos permitidos son: ${tiposValidos.join(', ')}` });
      }
  
      const unidadesMedida = await UnidadMedida.find({ tipo: tipo });
  
      if (unidadesMedida.length === 0) {
        return res.status(404).json({ msg: `No se encontraron unidades de medida del tipo '${tipo}'` });
      }
  
      res.json(unidadesMedida);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al obtener las unidades de medida', error: error.message });
    }
};

const MedidaProductoActualizarEstado = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    
    try {
        const unidadMedida = await UnidadMedida.findByIdAndUpdate(
            id,
            { estado },
            { new: true }
        );
  
        if (!unidadMedida) {
            return res.status(404).json({ mensaje: 'Medida de producto no encontrado.' });
        }
  
        res.json({ estado: unidadMedida.estado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar el estado de la Medida de producto.', error });
    }
};

module.exports = {
    unidadesMedidaGet,
    unidadesMedidaPost,
    unidadesMedidaPut,
    unidadesMedidaDelete,
    unidadMedidaGetById,
    unidadesMedidaGetByTipo,
    MedidaProductoActualizarEstado
};
