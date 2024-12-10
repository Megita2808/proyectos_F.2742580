const multer = require('multer');
const path = require('path');

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Lógica para decidir la carpeta de destino
        if (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            // Si el archivo es un documento, guardarlo en 'uploads/documents/'
            cb(null, 'uploads/documents/');
        } else {
            // Si no es un documento, guardarlo en 'uploads/'
            cb(null, 'uploads/');
        }
    },
    filename: (req, file, cb) => {
        // Renombrar el archivo para evitar conflictos de nombres
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Configura multer para usar esta configuración
const upload = multer({ storage: storage });

module.exports = upload;
