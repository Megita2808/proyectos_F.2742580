const { response } = require("express");
const Distribuidor = require('../../modules/distribuidor/distribuidorModule');
const Usuario = require('../../modules/usuario/usuarioModule');
const {UsuarioLocacion, Departamento} = require('../../modules/usuario/direccionModule');
const Rol = require('../../modules/usuario/rolModule');
const nodemailer = require('nodemailer');
const { guardarDireccion } = require('.././usuario/direccionesController');

const Estados = Object.freeze({
    INHABILITADO: "INHABILITADO",
    HABILITADO: "HABILITADO",
    SOLICITANTE: "SOLICITANTE",
    TRAMITADO: "TRAMITADO",
    ESPERA: "ESPERA"
});

const distribuidorGet = async (req, res) => {
    try {
        const distribuidores = await Distribuidor.find();

        const distribuidoresConDireccion = await Promise.all(
            distribuidores.map(async (distribuidor) => {
                const direccion = await UsuarioLocacion.findOne({ usuarioId: distribuidor.Usuario }).select('ciudades');
                
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
  
                    return { ...distribuidor.toObject(), direccion: locaciones };
                }
  
                return distribuidor.toObject();
            })
        );

        res.status(200).json({ distribuidores: distribuidoresConDireccion });
    } catch (error) {
        console.error('Error al obtener distribuidores:', error);
        res.status(500).json({ msg: "Error al obtener distribuidores" });
    }
};

const distribuidorPost = async (req, res) => {
    const { nombreEmpresa, CorreoEmpresa, telefono, direccion } = req.body;

    try {
        let usuario = await Usuario.findOne({ correo: CorreoEmpresa });

        if (!usuario) {
            const rolDistribuidor = await Rol.findOne({ nombreRol: 'Distribuidor' });

            if (!rolDistribuidor) {
                return res.status(404).json({ msg: 'Rol de distribuidor no encontrado' });
            }

            usuario = new Usuario({
                nombre: nombreEmpresa,
                password: 'defaultPassword',
                correo: CorreoEmpresa,
                telefono,
                rol: rolDistribuidor._id,
                estado: false,
            });

            await usuario.save();
        }

        const nuevoDistribuidor = new Distribuidor({
            nombreEmpresa,
            CorreoEmpresa,
            telefono,
            Usuario: usuario._id,
            estado: Distribuidor.Estados.SOLICITANTE,
        });

        await nuevoDistribuidor.save();

        if (direccion) {
            const direccionGuardada = await guardarDireccion(direccion);
            console.log('Dirección guardada:', direccionGuardada);
        }

        res.status(201).json({ msg: 'Distribuidor registrado correctamente.' });
    } catch (error) {
        console.error('Error al registrar distribuidor:', error);
        if (error.code === 11000) {
            res.status(401).json({ msg: 'Error de validación de distribuidor.', error: error.message });
        } else if (error.name === 'ValidationError') {
            res.status(400).json({ msg: 'El correo electrónico ya ha sido registrado previamente.' });
        } else {
            res.status(500).json({ msg: 'Error al registrar el distribuidor.' });
        }
    }
};

const distribuidorPut = async (req, res) => {
    const { id_distribuidor } = req.params;
    const { nombreEmpresa, CorreoEmpresa, telefono, estado, Usuario, direccion } = req.body;

    try {
        const distribuidorActualizado = await Distribuidor.findByIdAndUpdate(
            id_distribuidor,
            { nombreEmpresa, CorreoEmpresa, telefono, estado, Usuario },
            { new: true, runValidators: true }
        );

        if (!distribuidorActualizado) {
            return res.status(404).json({ msg: 'Distribuidor no encontrado' });
        }

        if (direccion) {
            const direccionGuardada = await guardarDireccion(direccion);
        }

        res.status(200).json({ msg: 'Distribuidor actualizado correctamente.' });
    } catch (error) {
        console.error('Error al actualizar distribuidor:', error);
        res.status(500).json({ msg: "Error al actualizar el distribuidor" });
    }
};

const distribuidorPutEstado = async (req, res) => {
    const { id_distribuidor } = req.params;
    const { estado } = req.body;
    try {
        const distribuidorActualizado = await Distribuidor.findByIdAndUpdate(
            id_distribuidor,
            { estado },
            { new: true, runValidators: true }
        );

        if (!distribuidorActualizado) {
            return res.status(404).json({ msg: 'Distribuidor no encontrado' });
        }

        res.status(200);
    } catch (error) {
        console.error('Error al actualizar distribuidor:', error);
        res.status(500).json({ msg: "Error al actualizar el distribuidor" });
    }
};

const distribuidorDelete = async (req, res = response) => {
    const { id_distribuidor } = req.params;
    try {
        const distribuidor = await Distribuidor.findByIdAndDelete(id_distribuidor);

        if (!distribuidor) {
            return res.status(404).json({ msg: 'Distribuidor no encontrado' });
        }

        res.json({ msg: 'Distribuidor eliminado exitosamente'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor al eliminar distribuidor' });
    }
};

const distribuidorUnico = async (req, res = response) => {
    const { id_distribuidor } = req.params;
    try {
        const distribuidor = await Distribuidor.findById(id_distribuidor);

        if (!distribuidor) {
            return res.status(404).json({ msg: 'Distribuidor no encontrado' });
        }
        res.json({
            _id: distribuidor.nombreEmpresa,
            nombre: distribuidor.CorreoEmpresa,
            dirreccion: distribuidor.direcciones,
            telefono: distribuidor.telefono,
            correo: distribuidor.telefono,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor al buscar el distribuidor' });
    }
};

const getDistribuidoresByEstado = async (req, res) => {
    const { estado } = req.params;

    const validEstados = Object.values(Estados);
    if (!validEstados.includes(estado)) {
        return res.status(400).json({ msg: "Estado inválido." });
    }

    try {
        const distribuidores = await Distribuidor.find({ estado: estado });
        if (distribuidores.length === 0) {
            return res.status(404).json({ msg: "No se encontraron distribuidores con ese estado." });
        }

        res.status(200).json(distribuidores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al buscar distribuidores." });
    }
};

module.exports = {
    distribuidorGet,
    distribuidorPost,
    distribuidorPut,
    distribuidorPutEstado,
    distribuidorDelete,
    distribuidorUnico,
    getDistribuidoresByEstado,
}