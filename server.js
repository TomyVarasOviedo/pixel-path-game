const {PORT} = require("./config.js");
const http = require('http');
const WebSocket = require("ws");
const express = require('express')
const path = require('path')


let adminClient = null
let cantidadClientes =0
let jugadoresPendientes = []
const app = express()
//CONFIGURACION PARA HTML RENDERIZADO
app.use(express.static(path.join(__dirname, '')))
//END POINTS DE HTTPS
app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, '', 'index.html'))
})
app.get("/admin/", (req, res)=>{
    res.sendFile(path.join(__dirname, '/admin', 'admin.html'))
})
const server = http.createServer(app)

//SOCKET PARA CONECTAR
const socket = new WebSocket.Server({ server })
// Manejador de eventos para cada conexión
socket.on("connection", (ws) => {
    console.log(`${ws.bufferedAmount}`);
    
    ws.on("message", (message) => {
        const data = JSON.parse(message);

        // Si el total de clics es igual o mayor a 2000, enviar un mensaje de ganador
        if (data.action == "iniciar_juego") {
            socket.clients.forEach(client =>{
                if (client.readyState == WebSocket.OPEN) {
                    client.send(JSON.stringify({ estado:"Iniciar_juego" }))
                }
            })
        }
        if(adminClient == null && data.jugador){
            // Si el admin no se encuentra logueado y llega un jugador los guarda como pendiente
            jugadoresPendientes.push(data.jugador)
            console.log(jugadoresPendientes);
            
        }else if (data.admin == true) {
            console.log("Admin encontrado");
            adminClient=ws
        }
        if(data.jugador && adminClient != null){
            adminClient.send(JSON.stringify({jugador:data.jugador}))
        }
        if (jugadoresPendientes.length != 0 && adminClient != null) {
            adminClient.send(JSON.stringify({pendientes:jugadoresPendientes}))
            jugadoresPendientes = []
        }
        
        if (data.win) {
            socket.clients.forEach(client =>{
                client.send(JSON.stringify({estado:"juego_terminado"}))
            })
            adminClient.send(JSON.stringify({winner:`${data.winner}`}))
        }
        
    });
});
server.listen(PORT, () => {
    console.log(`Servidor WebSocket escuchando en el puerto ${PORT}`);
});