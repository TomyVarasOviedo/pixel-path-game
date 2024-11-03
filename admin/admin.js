const PORT = 8080
const HOST = "pixel-path-game-production.up.railway.app"


const buttonInit = document.getElementById('inicio')
const tabla = document.getElementById('tabla-jugadores').getElementsByTagName('tbody')[0]
const socket = new WebSocket(`wss://${HOST}`);
let jugadores = []

socket.onopen =()=>{
    socket.send(JSON.stringify({admin:true}))
}
socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.pendientes) {
        jugadores.push(message.pendientes)
        console.log(jugadores);
        jugadores.forEach(jugador=>{
            agregarTabla(jugador)
        })
    }
    if (message.winner) {
        Swal.fire({
            title:"El ganador es:",
            icon:'success',
            iconColor:'#C89B3C',
            text:`${message.winner}`
        })
    }
    if (message.jugador) {
        jugadores.push(message.jugador)
        agregarTabla(message.jugador)
        console.log(jugadores);
        
    }
};
let agregarTabla =(jugador)=>{
    const fila = document.createElement('tr')
    const nombre = document.createElement('td')
    nombre.textContent = jugador
    fila.appendChild(nombre)
    tabla.appendChild(fila)

}
buttonInit.addEventListener("click", ()=>{
    console.log("Mensaje enviado...")
    socket.send(JSON.stringify({action:"iniciar_juego"}))
    Swal.fire({
        icon:'warning',
        iconColor:'#C89B3C',
        text:"Comenzando juego",
        showConfirmButton:false,
        timerProgressBar:true,
        timer:1500,
        didOpen: () => {
            Swal.showLoading();
        }
    })
})