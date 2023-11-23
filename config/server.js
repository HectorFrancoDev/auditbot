const express = require('express');
// const { WebhookClient } = require('dialogflow-fulfillment')
const cors = require('cors');
// const ngrok = require('ngrok');

const { dbConnection } = require('../config/database');

class Server 
{
    constructor() 
    {
        this.app  = express();
        this.port = process.env.PORT || 8080;
        this.ip = process.env.IP || "127.0.0.1";
        // Sockets
        // this.server = require('http').createServer( this.app );
        // this.io = require('socket.io')( this.server );

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() 
    {
        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Configuración bot
        this.app.use( express.urlencoded({extended: false}) );

        // Directorio Público
        // this.app.use( express.static('public') );
    }

    routes() 
    {
        this.app.use('/', require('../routes/bot'));
    }

    listen() 
    {
        // this.app.listen( this.port, this.ip, async () => {
        //     const url = await ngrok.connect(this.port);
        //     console.log(url);
        // });

        this.app.listen( this.port, () => {
            console.log("Servidor escuchando en el puerto: " + this.port);
        });
    }
}

module.exports = Server;