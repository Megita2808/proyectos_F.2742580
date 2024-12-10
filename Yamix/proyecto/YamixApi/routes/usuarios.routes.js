const express = require('express');
const usuario = require('../controller/usuarios_controller');
const upload = require('../config/multerConfig');

const router = express.Router();

router.post('/agregar_usuario',usuario.agregarUsuario)
router.get('/traer_usuarios',usuario.traer)
router.get('/usuariosEspera',usuario.traerEspera)
router.get('/obtener_usuario/:id', usuario.obtenerUsuario)
router.post('/editar_usuario/:id', usuario.editarUsuario)
router.delete('/eliminar_usuario/:id', usuario.eliminar)
router.post('/verificar_correo', usuario.verificarCorreo);
router.post('/verificar_correo_editar', usuario.verificarCorreoEditar);
router.get('/traer_clasesU', usuario.traerClasesU);

// Ruta para añadir un documento
router.post(
    '/add-documento',
    upload.array('documento'), // Cambiado para aceptar documentos
    usuario.addDocumento,
    (req, res) => {
        console.log('Campos del formulario:', req.body);
        console.log('Documento subido:', req.file);
        res.json({ success: true });
    }
);



// Ruta para añadir un documento en perfil
router.post(
    '/documentoperfil',
    upload.array('documento'), // Cambiado para aceptar documentos
    usuario.addDocumentoPerfil,
    (req, res) => {
        console.log('Campos del formulario:', req.body);
        console.log('Documento subido:', req.file);
        res.json({ success: true });
    }
);

router.put('/update-doc/:id_documento', upload.single('documento'), usuario.updateDocumento);

router.delete('/delete-document/:id_documento', usuario.deleteDocumento);

router.get('/traer_clasesU', usuario.traerClasesU);



//perfil

router.get('/usuario-completo/:id_usuario', usuario.obtenerUsuarioCompletoPorId);
router.put('/editar_perfil/:id_usuario', usuario.actualizarUsuarioPerfil);

router.get('/inasistencias/:id', usuario.obtenerConteoInasistencias);
module.exports = router;
