const auth = require('./routes/auth.routes');
const roles = require('./routes/roles.routes');
const cursos = require('./routes/cursos.routes'); 
const clases = require('./routes/clases.routes'); 
const asistencia = require('./routes/asistencia.routes'); 

const usuarios = require('./routes/usuarios.routes')

const eventos = require('./routes/calendario.routes'); 
const catalogo = require('./routes/catalogo.routes.js'); 
const perfil = require('./routes/perfil.routes');


const express = require('express');
const bodyParser = require('body-parser');

const path = require('path')

require('dotenv').config();


const app = express();
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({ limit:"50mb", extended: true }));

app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());



app.use('/api', auth, cursos , clases, asistencia, eventos, roles,usuarios,catalogo,perfil);



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});