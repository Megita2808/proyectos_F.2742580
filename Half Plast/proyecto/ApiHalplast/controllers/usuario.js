const { response } = require("express");
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const Usuario = require('../modules/usuario/usuarioModule');
const Rol = require('../modules/usuario/rolModule');
const Permiso = require('../modules/usuario/permisoModule');

const { Departamento, UsuarioLocacion }= require('../modules/usuario/direccionModule');

const { guardarDireccion, actualizarDireccionUnica } = require('./usuario/direccionesController');
const Venta = require("../modules/venta/ventaModule");

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'); 
const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
        encryptedData: encrypted,
        iv: iv.toString('hex'),
    };
};

const usuarioGet = async (req, res = response) => { 
    try {
        const usuarios = await Usuario.find().populate({
            path: 'rol',
            populate: { path: 'permisos' }
        });

        const usuariosConDireccion = await Promise.all(
            usuarios.map(async (usuario) => {
                const direccion = await UsuarioLocacion.findOne({ usuarioId: usuario._id }).select('ciudades');
                
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
  
                    return { ...usuario.toObject(), direccion: locaciones };
                }
  
                return usuario.toObject();
            })
        );

        res.json({ usuarios: usuariosConDireccion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor al obtener usuarios' });
    }
};

const usuarioGetRol = async (req, res = response) => {
    try {
        const { nombreRolEntrada } = req.params;
        const rol = await Rol.findOne({ nombreRol: nombreRolEntrada })
        const usuarios = await Usuario.find({rol : rol._id }).populate({
            path: 'rol',
            model: 'Rol'
        });
        res.json({ usuarios });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor al obtener usuarios' });
    }
};

const usuarioPost = async (req, res) => {
    const { nombre, password, correo, telefono, rolId, direccion } = req.body;

    try {
        let rol = false
        if (mongoose.Types.ObjectId.isValid(rol)) {
            rol = await Rol.findById(rolId);
        }else{
            rol = await Rol.findOne({nombreRol: 'Cliente'});
        }

        const nuevoUsuario = new Usuario({
            nombre,
            password,
            correo,
            telefono,
            rol: rol._id
        });

        direccion.usuario = nuevoUsuario.correo;
        await nuevoUsuario.save();

        await guardarDireccion(direccion);
        
        res.json({ msg: "Usuario registrado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al registrar el usuario" });
    }
};

const usuarioPut = async (req, res = response) => {
    try {
        const { id_usuario } = req.params;
        const { nombre, correo, telefono, rolId, direccion, idDireccion, direccionEditada } = req.body;

        const rol = await Rol.findById(rolId);
        if (!rol) {
            return res.status(401).json({ msg: "Rol no encontrado" });
        }

        console.log('paso por aca')
        const usuario = await Usuario.findOneAndUpdate(
            { _id: id_usuario },
            { nombre, correo, telefono, rol: rol._id }
        );

        if (!usuario) {
            return res.status(402).json({ msg: 'Usuario no encontrado' });
        }
        
        if(direccionEditada){
            const datos = await actualizarDireccionUnica(direccion, idDireccion)
        }

        res.json({ msg: 'Usuario actualizado exitosamente', usuario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor al actualizar usuario' });
    }
};

const usuarioDelete = async (req, res = response) => {
    const { id_usuario } = req.params;

    try {
        const usuario = await Usuario.findById(id_usuario);

        const rolDatos = await Rol.findById(usuario.rol);

        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        if (rolDatos.nombreRol == 'Administrador') {
            return res.status(403).json({ mensaje: 'No se puede cambiar eliminar de un usuario con rol Administrador.' });
        }

        const existeEnVenta = await Venta.findOne({ "usuario" : id_usuario });

        if (existeEnVenta) {
        return res.status(400).json({ msg: 'El usuario no puede ser eliminado porque está asociado a una o más compras.' });
        }

        const locacion = await UsuarioLocacion.findOne({ usuarioId: id_usuario });
    
        if (!locacion) {
          return res.status(402).json({ msg: 'Locacion no encontrado.' });
        }
        
        await locacion.deleteOne();
        await usuario.deleteOne();

        res.status(200).json({ msg: 'Usuario eliminado exitosamente'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor al eliminar usuario' });
    }
};

const confirmarPassword = async (req, res = response) => {
    const { correo, password } = req.body;
  
    try {
      const usuario = await Usuario.findOne({ correo: correo }).populate({
        path: 'rol',
        populate: { path: 'permisos' }
    });

      if (!usuario) {
        return res.status(203).json({ msg: 'Usuario no encontrado' });
      }

      if (usuario.password === password && usuario.estado) {

        const payload = {
          _id: usuario._id,
          correo: usuario.correo,
          rol: usuario.rol.nombreRol
        };
  
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: '2h'
        });
  
        res.status(200).json({
            msg: 'Su usuario se encuentra activo',
            _id: usuario._id,
            correo: usuario.correo,
            rol: {
                nombreRol: usuario.rol.nombreRol,
                permisos: usuario.rol.permisos,
                extraPorcentaje: usuario.rol.extraPorcentaje
            },
            token: token
        });
      } else if (usuario.password === password && !usuario.estado) {
        return res.status(201).json({ msg: 'Su usuario se encuentra inhabilitado' });
      } else {
        return res.status(202).json({ msg: 'Contraseña incorrecta' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error en el servidor al confirmar contraseña' });
    }
};

const recuperarPassword = async (req, res = response) => {
    const { correo } = req.body;

    try {
        const usuario = await Usuario.findOne({ correo: correo });
        if (!usuario) {
            return res.status(404).json({ msg: 'Correo no encontrado' });
        }

        const codigoAcceso = crypto.randomBytes(8).toString('hex');
        usuario.codigoAcceso = codigoAcceso;
        await usuario.save();

        const { encryptedData, iv } = encrypt(codigoAcceso);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        
        const mailOptions = {
            from: 'zsantiagohenao@gmail.com',
            to: usuario.correo,
            subject: 'Recuperación de contraseña',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                    <h1 style="color: #007BFF; text-align: center;">Recuperación de Contraseña</h1>
                    <p>Hola <strong>${usuario.nombre}</strong>,</p>
                    <p>Recibimos una solicitud para restablecer tu contraseña. Utiliza el siguiente código de acceso para completar el proceso:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <span style="display: inline-block; padding: 10px 20px; font-size: 1.5em; font-weight: bold; color: #ffffff; background-color: #007BFF; border-radius: 5px;">
                            ${codigoAcceso}
                        </span>
                    </div>
                    <p>Si no solicitaste restablecer tu contraseña, ignora este correo electrónico o contacta a nuestro equipo de soporte.</p>
                    <p style="margin-top: 20px;">Gracias,</p>
                    <p>El equipo de <strong>HalPlast</strong></p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <footer style="font-size: 0.9em; text-align: center; color: #666;">
                        <p>Este es un correo generado automáticamente. Por favor, no respondas a este mensaje.</p>
                        <p>&copy; 2024 HalPlast. Todos los derechos reservados.</p>
                    </footer>
                </div>
            `
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(300).json({error});
            }
        });
        
        res.status(200).json({
            msg: 'Solicitud enviada',
            data: { encryptedCode: encryptedData, iv },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor al recuperar contraseña' });
    }
};

const restablecerPassword = async (req, res = response) => {
    const { correo, codigoAcceso, nuevaPassword } = req.body;

    if (!correo || !codigoAcceso || !nuevaPassword) {
        return res.status(400).json({ msg: 'Por favor, proporcione todos los datos' });
    }

    try {
        const usuario = await Usuario.findOne({ correo, codigoAcceso });
        if (!usuario) {
            return res.status(404).json({ msg: 'Datos incorrectos' });
        }

        usuario.password = nuevaPassword;
        usuario.codigoAcceso = null;
        await usuario.save();

        return res.json({ msg: 'Contraseña restablecida correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor al restablecer contraseña' });
    }
};

const usuarioUnico = async (req, res = response) => {
    try {
        const { id_usuario } = req.params;
        let usuario = await Usuario.findOne({ correo: id_usuario }).populate('rol');

        if (!usuario) {
            usuario = await Usuario.findById(id_usuario).populate('rol');
            if (!usuario){
                return res.status(404).json({ msg: 'Usuario no encontrado' });
            }
        }

        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor al buscar usuario' });
    }
};

const obtenerRolUsuarioApi = async (req, res = response) => {
    try {
        const { correo } = req.params;
        const usuario = await Usuario.findOne({ correo: correo }).populate('rol');

        if (usuario) {
            const permisos = await Permiso.find({ _id: { $in: usuario.rol.permisos } });

            const empleado = permisos.some((permiso) => permiso.nombrePermiso === 'empleado');
            const cliente = permisos.some((permiso) => permiso.nombrePermiso === 'cliente');

            if (empleado) {
                return res.json({ rol: 'empleado' });
            } else if (cliente) {
                return res.json({ rol: 'cliente' });
            } else {
                return res.json({ rol: 'sin rol específico' });
            }
        } else {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el rol del usuario:', error);
        return res.status(500).json({ msg: 'Error al obtener el rol del usuario' });
    }
};

const UsuariroActualizarEstado = async (req, res = response) => {
    try {
        const { id_usuario } = req.params;
        const { estado } = req.body;

        if (typeof estado !== 'boolean') {
            return res.status(400).json({ mensaje: 'El estado debe ser un valor booleano.' });
        }

        const usuario = await Usuario.findById(id_usuario);

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
        }
        
        const rolDatos = await Rol.findById(usuario.rol);

        if (rolDatos.nombreRol === 'Administrador') {
            return res.status(403).json({ mensaje: 'No se puede cambiar el estado de un usuario con rol Administrador.' });
        }

        usuario.estado = estado;
        await usuario.save();

        res.status(200).json({ estado: usuario.estado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar el estado del usuario.' });
    }
};

module.exports = {
    usuarioGet,
    usuarioGetRol,
    usuarioPost,
    usuarioPut,
    usuarioDelete,
    confirmarPassword,
    recuperarPassword,
    restablecerPassword,
    usuarioUnico,
    obtenerRolUsuarioApi,
    UsuariroActualizarEstado,
};
