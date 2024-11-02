const {PORT} = require("./config.js");
const http = require('http');
const WebSocket = require("ws");
// Inicia el servidor WebSocket en el puerto PORT
const server = new WebSocket.Server({ port: PORT });
let adminClient = null
//END POINTS DE HTTPS
const httpServer = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("Servidor HTTP para WebSocket en Railway");
});
httpServer.listen(PORT, () => {
    console.log(`Servidor WebSocket escuchando en el puerto ${PORT}`);
});
// Manejador de eventos para cada conexión
server.on("connection", (ws) => {
    ws.on("message", (message) => {
        const data = JSON.parse(message);

        // Si el total de clics es igual o mayor a 2000, enviar un mensaje de ganador
        if (data.action == "iniciar_juego") {
            server.clients.forEach(client =>{
                if (client.readyState == WebSocket.OPEN) {
                    client.send(JSON.stringify({ estado:"Iniciar_juego" }))
                }
            })
        }
        if (data.admin == true) {
            console.log("Admin encontrado");
            adminClient=ws
        }
        if (data.win) {
            adminClient.send(JSON.stringify({winner:`${data.winner}`}))
        }
    });
});
