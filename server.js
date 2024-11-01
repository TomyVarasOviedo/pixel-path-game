const WebSocket = require("ws");

// Inicia el servidor WebSocket en el puerto 8080
const server = new WebSocket.Server({ port: 8080 });
let adminClient = null

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
