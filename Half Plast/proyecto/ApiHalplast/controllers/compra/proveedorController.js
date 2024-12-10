const mongoose = require('mongoose');

const Proveedor = require('../../modules/compra/proveedorModule');
const { Departamento, UsuarioLocacion }= require('../../modules/usuario/direccionModule');

const { guardarDireccion, actualizarDireccionUnica } = require('../usuario/direccionesController');
const Compra = require('../../modules/compra/compraModule');

const proveedoresGet = async (req, res = response) => {
  try {
      const proveedores = await Proveedor.find();

      const proveedoresConDireccion = await Promise.all(
          proveedores.map(async (proveedor) => {
              const direccion = await UsuarioLocacion.findOne({ proveedorId: proveedor._id }).select('ciudades');
              
              if (direccion) {
                  const ciudadIds = direccion.ciudades.map(ciudad => ciudad.ciudadId);
                  const departamentos = await Departamento.find(
                      { 'ciudades._id': { $in: ciudadIds } },
                      'nombreDepartamento ciudades.$'
                  );

                  const locaciones = direccion.ciudades.map(ciudad => {
                      const departamentoInfo = departamentos.find(dept => 
                          dept.ciudades.some(c => c._id.equals(ciudad.ciudadId))
                      );
                      const nombreCiudad = departamentoInfo ? departamentoInfo.ciudades[0].nombreCiudad : 'Ciudad desconocida';
                      const nombreDepartamento = departamentoInfo ? departamentoInfo.nombreDepartamento : 'Departamento desconocido';

                      return {
                          departamento: nombreDepartamento,
                          ciudad: nombreCiudad,
                          locaciones: ciudad.locaciones
                      };
                  });

                  return { ...proveedor.toObject(), direccion: locaciones };
              }

              return proveedor.toObject();
          })
      );

      res.json({ proveedores: proveedoresConDireccion });
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al obtener los proveedores con sus direcciones.' });
  }
};

const proveedorUnicoGet = async (req, res) => {
  const { id } = req.params;
  try {
    const proveedor = await Proveedor.findById(id);

    if (!proveedor) {
      return res.status(404).json({ msg: 'Proveedor no encontrado.' });
    }

    res.json(proveedor);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener el proveedor.', error });
  }
};

const proveedorPost = async (req, res) => {
  const { nombre, correo, telefono, documento, tipoDocumento, direccion } = req.body;

  const proveedorDatos = new Proveedor({
      nombre,
      correo,
      telefono,
      documento,
      tipoDocumento
  });

  try {
      const proveedor = await proveedorDatos.save();

      direccion.proveedor = proveedor.correo;

      await guardarDireccion(direccion);
      res.status(201).json({ msg: 'Proveedor registrado correctamente'});
  } catch (error) {
    if (error.status === 409) {
        res.status(409).json({ msg: 'Error al registrar el proveedor', error: error.message });
    } else {
        res.status(500).json({ msg: 'Error al registrar el proveedor', error: error.message });
    }
  }
};

const proveedorPut = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, telefono, documento, tipoDocumento, direccion, idDireccion, direccionEditada } = req.body;
  
  try {
    const proveedorActual = await Proveedor.findById(id);
    if (!proveedorActual) {
      return res.status(404).json({ msg: 'Proveedor no encontrado.' });
    }

    const updateFields = {};
    if (nombre && proveedorActual.nombre !== nombre && nombre !== '') {
      updateFields.nombre = nombre;
    }
    if (correo && proveedorActual.correo !== correo && correo !== '') {
      updateFields.correo = correo;
    }
    if (telefono && proveedorActual.telefono !== telefono && telefono !== '') {
      updateFields.telefono = telefono;
    }
    if (documento && proveedorActual.documento !== documento && documento !== '') {
      updateFields.documento = documento;
    }
    if (tipoDocumento && proveedorActual.tipoDocumento !== tipoDocumento && tipoDocumento !== '') {
      updateFields.tipoDocumento = tipoDocumento;
    }
    
    if (Object.keys(updateFields).length === 0 && !direccionEditada) {
      return res.status(200).json({ msg: 'No se realizaron cambios en los datos del proveedor.' });
    }

    await Proveedor.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });

    const datos = await actualizarDireccionUnica(direccion, idDireccion)
    res.status(200).json({ msg: 'Proveedor actualizado exitosamente' });
  } catch (error) {
    if (error.status === 409) {
        res.status(409).json({ msg: 'Error al editar el proveedor', error: error.message });
    } else {
        res.status(500).json({ msg: 'Error al editar el proveedor', error: error.message });
    }
  }
};

const proveedorDelete = async (req, res) => {
  const { id } = req.params;

  try {
    const existeEnCompra = await Compra.findOne({ "detalleCompra.proveedor": id });

    if (existeEnCompra) {
      return res.status(400).json({ msg: 'El proveedor no puede ser eliminado porque está asociado a una o más compras.' });
    }

    const proveedor = await Proveedor.findByIdAndDelete(id);

    if (!proveedor) {
      return res.status(401).json({ msg: 'Proveedor no encontrado.' });
    }

    const locacion = await UsuarioLocacion.findOne({ proveedorId: id });
    
    if (!locacion) {
      return res.status(402).json({ msg: 'Locacion no encontrado.' });
    }

    await locacion.deleteOne();

    res.status(200).json({ msg: 'Proveedor eliminado exitosamente'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor al eliminar el proveedor.', error });
  }
};

const proveedorActualizarEstado = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (typeof estado !== 'boolean') {
    return res.status(400).json({ msg: 'El estado debe ser un valor booleano.' });
  }

  try {
    const proveedor = await Proveedor.findByIdAndUpdate(id, { estado }, { new: true });

    if (!proveedor) {
      return res.status(404).json({ msg: 'Proveedor no encontrado.' });
    }

    res.json({ msg: 'Estado del proveedor actualizado correctamente', estado: proveedor.estado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar el estado del proveedor.', error });
  }
};

module.exports = {
  proveedoresGet,
  proveedorUnicoGet,
  proveedorPost,
  proveedorPut,
  proveedorDelete,
  proveedorActualizarEstado,
};