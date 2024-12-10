const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const {
    TodosModulosImagen,
    ModuloImagenUnico,
    AgregarModuloImagen,
    EditarModuloImagen,
    ActualizarEstadoModuloImagen,
    EliminarModuloImagen,
    EliminarModuloCompleto
} = require('../../controllers/img/Imagen');

router.get('/imagen', TodosModulosImagen);
router.get('/imagen/unico/:moduleName', ModuloImagenUnico);
router.post('/imagen/:moduleName', upload.single('file'), AgregarModuloImagen);
router.put('/imagen/:moduleName', upload.single('file'), EditarModuloImagen);
router.put('/imagen/estado/:imageId', ActualizarEstadoModuloImagen);
router.delete('/imagen/unica/:imageId', EliminarModuloImagen);
router.delete('/imagen/todo/:moduleName', EliminarModuloCompleto);

module.exports = router;
