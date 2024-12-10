const mongoose = require('mongoose');
const { Departamento, UsuarioLocacion }= require('../../modules/usuario/direccionModule');
const Usuario = require('../../modules/usuario/usuarioModule');
const Proveedor = require('../../modules/compra/proveedorModule');

const obtenerTodosLosDepartamentos = async (req, res) => {
    try {
        const departamentos = await Departamento.find();
        res.status(200).json(departamentos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los departamentos', error });
    }
};

const obtenerLocacionesDeUsuarioOProveedor = async (req, res) => {
    const { usuarioCorreo } = req.params;
    try {
        let usuarioModelo = await Usuario.findOne({ correo: usuarioCorreo }).select('_id');
        if (!usuarioModelo){
            usuarioModelo = await Usuario.findById(usuarioCorreo).select('_id');
        }

        if (!usuarioModelo){
            let proveedorModelo = await Proveedor.findOne({ correo: usuarioCorreo }).select('_id');
            if (!proveedorModelo){
                proveedorModelo = await Proveedor.findById(usuarioCorreo).select('_id');
            }    
        }

        if (!usuarioModelo && !proveedorModelo) {
            return res.status(404).json({ message: 'No se encontró el usuario o proveedor.' });
        }

        let locacion;
        if (usuarioModelo) {
            locacion = await UsuarioLocacion.findOne({ usuarioId: usuarioModelo._id }).select('ciudades');
        } else if (proveedorModelo) {
            locacion = await UsuarioLocacion.findOne({ proveedorId: proveedorModelo._id }).select('ciudades');
        }

        if (!locacion) {
            return res.status(404).json({ message: 'No se encontraron locaciones.' });
        }

        const ciudadIds = locacion.ciudades.map(ciudad => ciudad.ciudadId);
        const departamentos = await Departamento.find({ 'ciudades._id': { $in: ciudadIds } }, 'nombreDepartamento ciudades.$');

        const locaciones = locacion.ciudades.map(ciudad => {
            const departamentoInfo = departamentos.find(dept => dept.ciudades.some(c => c._id.equals(ciudad.ciudadId)));
            const nombreCiudad = departamentoInfo ? departamentoInfo.ciudades[0].nombreCiudad : 'Ciudad desconocida';
            const nombreDepartamento = departamentoInfo ? departamentoInfo.nombreDepartamento : 'Departamento desconocido';

            return {
                departamento: nombreDepartamento,
                ciudad: nombreCiudad,
                locaciones: ciudad.locaciones
            };
        });

        if (!locaciones.length) {
            return res.status(404).json({ message: 'No se encontraron locaciones.' });
        }

        res.status(200).json({
            tipo: usuarioModelo ? 'Usuario' : 'Proveedor',
            locaciones
        });
    } catch (error) {
        console.error('Error al obtener las locaciones:', error);
        res.status(500).json({ message: 'Error al obtener las locaciones.', error: error.message });
    }
};

const guardarDireccion = async (Datosdireccion) => {
    try {
        if (!Datosdireccion || (!Datosdireccion.usuario && !Datosdireccion.proveedor) || !Datosdireccion.nombreDepartamento || !Datosdireccion.ciudades) {
            return { status: 400, message: 'Datos incompletos' };
        }

        let modelo = null;
        let query = {};

        if (Datosdireccion.usuario) {
            modelo = await Usuario.findOne({ correo: Datosdireccion.usuario });
            if (!modelo) return { status: 404, message: 'Usuario no encontrado' };
            query = { usuarioId: modelo._id };
        } else if (Datosdireccion.proveedor) {
            modelo = await Proveedor.findOne({ correo: Datosdireccion.proveedor });
            if (!modelo) return { status: 404, message: 'Proveedor no encontrado' };
            query = { proveedorId: modelo._id };
        }

        let usuarioLocacion = await UsuarioLocacion.findOne(query) || new UsuarioLocacion({ ...query, ciudades: [] });

        let departamento = await Departamento.findOne({ nombreDepartamento: Datosdireccion.nombreDepartamento });
        if (!departamento) {
            departamento = new Departamento({ nombreDepartamento: Datosdireccion.nombreDepartamento, ciudades: [] });
            await departamento.save();
        }

        let identificadorLocacion;

        for (const ciudadData of Datosdireccion.ciudades) {
            const { nombreCiudad, locaciones } = ciudadData;

            let ciudad = departamento.ciudades.find(c => c.nombreCiudad === nombreCiudad);
            if (!ciudad) {
                ciudad = { nombreCiudad, _id: new mongoose.Types.ObjectId() };
                departamento.ciudades.push(ciudad);
                await departamento.save();
            }

            let usuarioCiudad = usuarioLocacion.ciudades.find(c => c.ciudadId.equals(ciudad._id));
            if (!usuarioCiudad) {
                usuarioCiudad = {
                    ciudadId: ciudad._id,
                    locaciones: locaciones.map(loc => ({
                        ...loc,
                        _id: new mongoose.Types.ObjectId()
                    }))
                };
                usuarioLocacion.ciudades.push(usuarioCiudad);
                identificadorLocacion = usuarioCiudad.locaciones[0]._id;
            } else {
                for (const locacion of locaciones) {
                    const { locacion: nombreLocacion, coordenadas } = locacion;

                    let locacionExistente = usuarioCiudad.locaciones.find(l => l.locacion === nombreLocacion);
                    if (!locacionExistente) {
                        const nuevaLocacion = {
                            locacion: nombreLocacion,
                            coordenadas,
                            _id: new mongoose.Types.ObjectId()
                        };
                        usuarioCiudad.locaciones.push(nuevaLocacion);
                        identificadorLocacion = nuevaLocacion._id;
                    } else {
                        identificadorLocacion = locacionExistente._id;
                    }
                }
            }

            usuarioLocacion.markModified("ciudades");
        }

        await usuarioLocacion.save();
        return { locacionId: identificadorLocacion };

    } catch (error) {
        console.error("Error al guardar la dirección:", error);
        return { status: 500, message: 'Error al guardar la dirección', error };
    }
};

const guardarDireccion2 = async (req, res) => {
    const { Datosdireccion } = req.body;
    try {
        if (!Datosdireccion || !Datosdireccion.usuario || !Datosdireccion.nombreDepartamento || !Datosdireccion.ciudades) {
            return { status: 400, message: 'Datos incompletos' };
        }

        const usuario = await Usuario.findOne({ correo: Datosdireccion.usuario });
        if (!usuario) return { status: 404, message: 'Usuario no encontrado' };

        let usuarioLocacion = await UsuarioLocacion.findOne({ usuarioId: usuario._id }) || new UsuarioLocacion({ usuarioId: usuario._id, ciudades: [] });

        let departamento = await Departamento.findOne({ nombreDepartamento: Datosdireccion.nombreDepartamento });
        if (!departamento) {
            departamento = new Departamento({ nombreDepartamento: Datosdireccion.nombreDepartamento, ciudades: [] });
            await departamento.save();
        }
        let identificadorLocacion;

        for (const ciudadData of Datosdireccion.ciudades) {
            const { nombreCiudad, locaciones } = ciudadData;

            let ciudad = departamento.ciudades.find(c => c.nombreCiudad === nombreCiudad);
            if (!ciudad) {
                ciudad = { nombreCiudad, _id: new mongoose.Types.ObjectId() };
                departamento.ciudades.push(ciudad);
                await departamento.save();
            }
            let usuarioCiudad = usuarioLocacion.ciudades.find(c => c.ciudadId.equals(ciudad._id));
            if (!usuarioCiudad) {
                usuarioCiudad = {
                    ciudadId: ciudad._id,
                    locaciones: locaciones.map(loc => ({
                        ...loc,
                        _id: new mongoose.Types.ObjectId()
                    }))
                };
                usuarioLocacion.ciudades.push(usuarioCiudad);
                identificadorLocacion = usuarioCiudad.locaciones[0]._id;
            } else {
                for (const locacion of locaciones) {
                    const { locacion: nombreLocacion, coordenadas } = locacion;

                    let locacionExistente = usuarioCiudad.locaciones.find(l => l.locacion === nombreLocacion);
                    if (!locacionExistente) {
                        const nuevaLocacion = {
                            locacion: nombreLocacion,
                            coordenadas,
                            _id: new mongoose.Types.ObjectId()
                        };
                        usuarioCiudad.locaciones.push(nuevaLocacion);
                        identificadorLocacion = nuevaLocacion._id;
                    } else {
                        identificadorLocacion = locacionExistente._id;
                    }
                }
            }

            usuarioLocacion.markModified("ciudades");
        }
        await usuarioLocacion.save();
        return { locacionId: identificadorLocacion };

    } catch (error) {
        console.error("Error al guardar la dirección:", error);
        return { status: 500, message: 'Error al guardar la dirección', error };
    }
};

const actualizarDireccionUnica = async (Datosdireccion, idDireccion) => {
    try {
        if (!Datosdireccion || (!Datosdireccion.usuario && !Datosdireccion.proveedor) || !Datosdireccion.nombreDepartamento || !Datosdireccion.ciudades) {
            return { status: 400, message: 'Datos incompletos' };
        }

        let modelo = null;
        let query = {};

        if (Datosdireccion.usuario) {
            modelo = await Usuario.findOne({ correo: Datosdireccion.usuario });
            if (!modelo) return { status: 404, message: 'Usuario no encontrado' };
            query = { usuarioId: modelo._id };
        } else if (Datosdireccion.proveedor) {
            modelo = await Proveedor.findOne({ correo: Datosdireccion.proveedor });
            if (!modelo) return { status: 404, message: 'Proveedor no encontrado' };
            query = { proveedorId: modelo._id };
        }

        let usuarioLocacion = await UsuarioLocacion.findOne(query) || new UsuarioLocacion({ ...query, ciudades: [] });
        let departamento = await Departamento.findOne({ nombreDepartamento: Datosdireccion.nombreDepartamento });
        if (!departamento) {
            departamento = new Departamento({ nombreDepartamento: Datosdireccion.nombreDepartamento, ciudades: [] });
            await departamento.save();
        }

        let identificadorLocacion;

        for (const ciudadData of Datosdireccion.ciudades) {
            const { nombreCiudad, locaciones } = ciudadData;
            let ciudad = departamento.ciudades.find(c => c.nombreCiudad === nombreCiudad);
            if (!ciudad) {
                ciudad = { nombreCiudad, _id: new mongoose.Types.ObjectId() };
                departamento.ciudades.push(ciudad);
                await departamento.save();
            }

            let usuarioCiudad = usuarioLocacion.ciudades.find(c => c.ciudadId.equals(ciudad._id));

            if (!usuarioCiudad) {
                usuarioLocacion.ciudades.push({
                    ciudadId: ciudad._id,
                    locaciones: []
                });
                usuarioLocacion.ciudades = usuarioLocacion.ciudades.filter(c => c.ciudadId.equals(ciudad._id));
                usuarioCiudad = usuarioLocacion.ciudades.find(c => c.ciudadId.equals(ciudad._id));
            } else {
                if (!usuarioCiudad.locaciones) {
                    usuarioCiudad.locaciones = [];
                }
                usuarioCiudad.locaciones = usuarioCiudad.locaciones.filter(l => !l._id.equals(idDireccion));
            }
            
            for (const locacion of locaciones) {
                const { locacion: nombreLocacion, coordenadas } = locacion;

                const nuevaLocacion = {
                    locacion: nombreLocacion,
                    coordenadas,
                    _id: new mongoose.Types.ObjectId()
                };

                usuarioCiudad.locaciones.push(nuevaLocacion);
                identificadorLocacion = nuevaLocacion._id;
            }

            usuarioLocacion.markModified("ciudades");
        }

        await usuarioLocacion.save();
        return { locacionId: identificadorLocacion };

    } catch (error) {
        console.error("Error al actualizar la dirección:", error);
        return { status: 500, message: 'Error al actualizar la dirección', error };
    }
};

const actualizarDireccion = async (req, res) => {
    const { id } = req.params;
    const { direccion } = req.body;
    try {
        const direccionActualizada = await Usuario.findByIdAndUpdate(id, direccion, { new: true });
        if (!direccionActualizada) {
            return res.status(404).json({ message: 'Dirección no encontrada' });
        }
        res.status(200).json(direccionActualizada);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar la dirección', error });
    }
};

const inhabilitarDireccion = async (req, res) => {
    const { id } = req.params;
    try {
        const direccionInhabilitada = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true });
        if (!direccionInhabilitada) {
            return res.status(404).json({ message: 'Dirección no encontrada' });
        }
        res.status(200).json(direccionInhabilitada);
    } catch (error) {
        res.status(400).json({ message: 'Error al inhabilitar la dirección', error });
    }
};

const eliminarDireccion = async (req, res) => {
    const { id } = req.params;
    try {
        const direccionEliminada = await Usuario.findByIdAndDelete(id);
        if (!direccionEliminada) {
            return res.status(404).json({ message: 'Dirección no encontrada' });
        }
        res.status(200).json({ message: 'Dirección eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la dirección', error });
    }
};

module.exports = {
    obtenerTodosLosDepartamentos,
    obtenerLocacionesDeUsuarioOProveedor,
    guardarDireccion,
    guardarDireccion2,
    actualizarDireccionUnica,
    actualizarDireccion,
    inhabilitarDireccion,
    eliminarDireccion
};
