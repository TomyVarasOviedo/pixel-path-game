import { PORT } from "./config.js";
// Conectarse al servidor WebSocket
const socket = new WebSocket("ws://localhost:PORT");

// Elementos de la página
const clickButton = document.getElementById("clickButton");
const counterDisplay = document.getElementById("counter");
const PUNTOS_FINALES = 50
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
                if (login != "") {
                    player = login
                }else{
                    throw EvalError
                }
            }
            catch(EvalError){
                Swal.showValidationMessage(`Ingresa un nombre valido por favor`);  
            }
          },
          allowOutsideClick:false,
          iconColor:"#C89B3C",
          showClass:{
            popup: 'swal2-show',
            backdrop: 'swal2-backdrop-show',
            icon: 'swal2-icon-show'
            }
    }).then(result=>{
        if (result.isConfirmed) {
            Swal.fire({
                icon:"success",
                showConfirmButton:false,
                timer:1500,
                iconColor:"#C89B3C",
                showClass:{
                    popup: 'swal2-show',
                    backdrop: 'swal2-backdrop-show',
                    icon: 'swal2-icon-show'
                  }
            })
        }
    })
}

clickButton.addEventListener("click", () => {
    totalClicks = clicks++;
    counterDisplay.textContent = `${clicks}`;
    // Chequear si ha llegado a 2000
    if (totalClicks >= PUNTOS_FINALES) {
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
        Swal.fire({
            icon:"warning",
            text:"El juego esta comenzando",
            timer:1500,
            iconColor:"#C89B3C",
            showClass:{
                popup: 'swal2-show',
                backdrop: 'swal2-backdrop-show',
                icon: 'swal2-icon-show'
              }
        })
        clickButton.removeAttribute("disabled")
    }
};
