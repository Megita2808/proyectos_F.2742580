const express = require('express');
const { dbConnection } = require('../database/config');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocket = require('ws');
const multer = require('multer');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.server = http.createServer(this.app);
        this.wss = new WebSocket.Server({ server: this.server });

        this.enviosPath = "/api";
        
        this.middlewares();
        this.routes();
        this.connectDb();
        this.configureWebSocket();
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Escuchando en el puerto ${this.port}`);
        });
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(express.static(__dirname + "/public"));
    }

    routes() {
        this.app.use(this.enviosPath, require("../routes/envio/envio"));
        this.app.use(this.enviosPath, require("../routes/usuario"));
        this.app.use(this.enviosPath, require("../routes/pqrs/pqrs"));
        this.app.use(this.enviosPath, require("../routes/pqrs/tipoPqrs"));
        this.app.use(this.enviosPath, require("../routes/pqrs/chatPqrs"));
        this.app.use(this.enviosPath, require("../routes/pqrs/chatPqrsMensajes"));
        this.app.use(this.enviosPath, require("../routes/Catalogo/categoria"));
        this.app.use(this.enviosPath, require("../routes/Catalogo/producto"));
        this.app.use(this.enviosPath, require("../routes/Catalogo/medidaProducto"));
        this.app.use(this.enviosPath, require("../routes/Catalogo/medidaVenta"));
        this.app.use(this.enviosPath, require("../routes/Catalogo/color"));
        this.app.use(this.enviosPath, require("../routes/img/imagen"));
        this.app.use(this.enviosPath, require("../routes/unidadMedida/routesUnidadMedida"));
        this.app.use(this.enviosPath, require("../routes/precioVenta/PrecioVentaRoutes"));
        this.app.use(this.enviosPath, require("../routes/Catalogo/peso"));
        this.app.use(this.enviosPath, require("../routes/Catalogo/catalagoRoutes"));
        this.app.use(this.enviosPath, require("../routes/distribuidor/distribuidorRoutes"));
        this.app.use(this.enviosPath, require("../routes/usuario/permisoRoutes"));
        this.app.use(this.enviosPath, require("../routes/usuario/rolRoutes"));
        this.app.use(this.enviosPath, require("../routes/usuario/direccionRoutes"));
        this.app.use(this.enviosPath, require("../routes/venta/venta"));
        this.app.use(this.enviosPath, require("../routes/envio/envio"));
        this.app.use(this.enviosPath, require("../routes/seguridad/reCAPTCHA"));
        this.app.use(this.enviosPath, require("../routes/compra/proveedorRoutes"));
        this.app.use(this.enviosPath, require("../routes/compra/compraRoutes"));
        this.app.use(this.enviosPath, require("../routes/Dashboard/dashboardRoutes"));
        this.app.use(this.enviosPath, require("../routes/cambiarEstado/cambiarEstadoRoutes"));
    }

    async connectDb() {
        try {
            await dbConnection();
            console.log('Conexión a la base de datos exitosa');
        } catch (error) {
            console.error('Error al conectar con la base de datos:', error);
            process.exit(1);
        }
    }

    configureWebSocket() {
        this.wss.on('connection', (ws) => {
            console.log('Nuevo cliente conectado');
            console.log(`Clientes conectados: ${this.wss.clients.size}`);
        
            ws.on('message', async (message) => {
                try {
                    const data = JSON.parse(message);
                    this.wss.clients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify(data));
                        }
                    });
                } catch (error) {
                    console.error('Error al procesar el mensaje:', error);
                }
            });
        
            ws.on('close', () => {
                console.log('Cliente desconectado');
                console.log(`Clientes conectados: ${this.wss.clients.size}`);
            });
        });

        this.wss.on('error', (error) => {
            console.error('Error en el servidor WebSocket:', error);
        });
    }
}

module.exports = Server;
