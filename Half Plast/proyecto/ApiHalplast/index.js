require('dotenv').config();
const Server = require('./modules/server');
const MedidaProducto = require('./modules/Catalogo/medidaProducto');
const server = new Server();

const { sincronizarseGitRemoto } = require('./controllers/img/Imagen');
sincronizarseGitRemoto().catch((error) => {
    console.error('Error al sincronizar el repositorio al iniciar la API:', error.message);
});

const { inicializarPermisosAndRoles } = require('./controllers/usuario/rolController');
const { isValidObjectId } = require('mongoose');
inicializarPermisosAndRoles().catch((error) => {
    console.error('Error al inicializar roles al iniciar la API:', error.message);
});
server.listen(); 