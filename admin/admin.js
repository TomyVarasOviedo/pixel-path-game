const buttonInit = document.getElementById('inicio')
const socket = new WebSocket("ws://localhost:8080");

socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    
    if (message.winner) {
        alert("El ganador es "+message.winner)
    }
};

buttonInit.addEventListener("click", ()=>{
    console.log("Mensaje enviado...")
    socket.send(JSON.stringify({admin:true}))
    socket.send(JSON.stringify({action:"iniciar_juego"}))
})