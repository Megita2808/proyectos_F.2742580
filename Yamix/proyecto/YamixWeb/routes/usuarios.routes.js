const express = require('express');
const router = express.Router();
const multer = require('multer');

const { verifyToken } = require('../controller/middleware/verificarToken');
const { restrictToPermiso } = require('../controller/middleware/redirect');

const usuarios = require('../controller/usuarios_controller');

const storage = multer.memoryStorage(); // Usar memoria en lugar de almacenamiento en disco
const upload = multer({ storage: storage });
const { attachUserPermissions } = require('../controller/middleware/permisosVista');

router.use(attachUserPermissions);

// Enrutador para manejar el formulario de carga
router.post('/add_documento', upload.array('nuevoDocumento[]'), usuarios.addDocument);

// Controlador traer estudiantes
router.get('/estudiantes', verifyToken, usuarios.traer, (req, res) => {
    res.render('./admin/estudiantes', { data: res.locals.data });
});


// Integrar middleware para verificar permisos y renderizar calendario
router.get('/calendarioUser', verifyToken, (req, res) => {
    // Comprobar el rol o permisos del usuario cargados en req.usuario
    const { rol } = req.usuario;

    if (rol === 'profesor') {
        res.render('calendarioProfe', { alert: false });
    } else {
        res.render('calendarioUser', { alert: false });
    }
});



// Controlador traer maestros
router.get('/profesores', verifyToken, usuarios.traer, (req, res) => {
    res.render('./admin/profesores', { data: res.locals.data });
});

// Renderizado del calendario para profesores
router.get('/calendarioProfe', (req, res) => {
    res.render('calendarioProfe', { alert: false });
});

// Controlador traer admin
router.get('/administradores', verifyToken, usuarios.traer, (req, res) => {
    res.render('./admin/administradores', { data: res.locals.data });
});
router.get('/usuariosEspera', verifyToken, usuarios.traerEspera, (req, res) => {
    res.render('./admin/soloEspera', { data: res.locals.data });
});



// Controladores usuarios
router.post('/agregar_usuario', (req, res, next) => {
    next();
}, usuarios.agregarUsuario);

router.get('/usuariosAdmin',verifyToken, restrictToPermiso('usuarios'),attachUserPermissions, usuarios.traer, (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('./admin/usuariosAdmin', { data: res.locals.data, usuarios: usuarios, permisos: userPermissions, usuarioId: req.usuario.id  });
});


router.get('/profesoresAdmin',verifyToken, restrictToPermiso('usuarios'), attachUserPermissions,usuarios.traer, (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('./admin/profesoresAdmin', { data: res.locals.data,  permisos: userPermissions });
});

router.get('/estudiantesAdmin', verifyToken, restrictToPermiso('usuarios'),attachUserPermissions, usuarios.traer, (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('./admin/estudiantesAdmin', { data: res.locals.data,  permisos: userPermissions });
});
router.get('/userEsperaAdmin', verifyToken, restrictToPermiso('usuarios'), attachUserPermissions, usuarios.traer, (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('./admin/userEsperaAdmin', { data: res.locals.data,  permisos: userPermissions });
});
router.get('/userDeshabilitadoAdmin', verifyToken,restrictToPermiso('usuarios'),attachUserPermissions, usuarios.traer, (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('./admin/userDeshabilitadoAdmin', { data: res.locals.data,  permisos: userPermissions });
});
router.get('/userOtrosAdmin',verifyToken,restrictToPermiso('usuarios'),attachUserPermissions, usuarios.traer, (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('./admin/userOtrosAdmin', { data: res.locals.data,  permisos: userPermissions });
});


// Ruta para mostrar el formulario de edición
router.get('/editar_usuario/:id', usuarios.obtenerUsuarioPorId, (req, res) => {
    res.render('./admin/editar_usuario', { usuario: res.locals.usuario });
});

router.post('/editar_usuario/:id', 
    (req, res, next) => {
        console.log('Solicitud POST recibida para editar usuario');
        console.log('ID del usuario:', req.params.id); // Log del ID del usuario
        console.log('Body de la solicitud:', req.body); // Log del cuerpo de la solicitud
        next();
    }, 
    usuarios.editarUsuario);




router.delete('/eliminar/:id', usuarios.eliminarUsuario);

router.get('/inscripciones', usuarios.traer, (req, res) => {
    res.render('./admin/inscripciones', { data: res.locals.data });
});

router.get(
    '/perfil',
    verifyToken,
    restrictToPermiso('perfil'),
    usuarios.obtenerUsuarioCompleto,
    usuarios.obtenerInasistencias,
    attachUserPermissions,
    (req, res) => {
      const userPermissions = req.usuario ? req.usuario.permisos : [];
      const token = req.token; // Obtener el token desde req
      res.render('web/perfil', {
        permisos: userPermissions,
        usuario: res.locals.usuario || { documentos: [] },
        inasistencias: res.locals.inasistencias || [],
        jwt: token, // Pasar el token a la vista
      });
    }
  );
  



module.exports = router;
