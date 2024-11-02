import { PORT } from "./config.js";
// Conectarse al servidor WebSocket
const socket = new WebSocket("ws://localhost:PORT");

// Elementos de la página
const clickButton = document.getElementById("clickButton");
const counterDisplay = document.getElementById("counter");

// Contador de clics
let clicks = 0;
let totalClicks
let player =""
// Función para actualizar contador
let inputName=()=>{
    Swal.fire({
        title: "Ingresa tu nombre",
        input:"text",
        showCancelButton: false,
        confirmButtonText: "Confirmar",
        showLoaderOnConfirm: true,
        preConfirm: async (login) => {
            try {
                player = login
            }
            catch (error) {
              Swal.showValidationMessage(`
                Request failed: ${error}
              `);
            }
          },
          allowOutsideClick:false,
    }).then(result=>{
        if (result.isConfirmed) {
            Swal.fire({
                icon:"success",
                showConfirmButton:false,
                timer:1500
            })
        }
    })
}

clickButton.addEventListener("click", () => {
    totalClicks = clicks++;
    counterDisplay.textContent = `Contador: ${clicks}`;
    // Chequear si ha llegado a 2000
    if (clicks >= 40) {
        socket.send(JSON.stringify({ win:true, winner:player }));
        
    }
});
document.addEventListener("DOMContentLoaded", e=>{
    inputName()
})
// Escuchar mensajes del servidor WebSocket
socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    
    if (message.estado == "Iniciar_juego") {
        console.log("Iniciando el juego");
        
        clickButton.removeAttribute("disabled")
    }
};
