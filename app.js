
const PORT = 8080
const HOST = "pixel-path-game-production.up.railway.app"
// Conectarse al servidor WebSocket
const socket = new WebSocket(`wss://${HOST}`);

// Elementos de la página
const clickButton = document.getElementById("clickButton");
const counterDisplay = document.getElementById("counter");
const PUNTOS_FINALES = 100
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
            socket.send(JSON.stringify({jugador:player}))
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
    if (totalClicks >= (PUNTOS_FINALES - 1)) {
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
    if (message.estado == "juego_terminado") {
        clickButton.setAttribute('disabled', "true")
        Swal.fire({
            icon:"warning",
            text:"El juego se termino",
            allowOutsideClick:false,
            iconColor:"#C89B3C",
            showClass:{
                popup: 'swal2-show',
                backdrop: 'swal2-backdrop-show',
                icon: 'swal2-icon-show'
              },
              showConfirmButton:false,
              timerProgressBar:true,
              timer:1500,
              didOpen: () => {
                  Swal.showLoading();
              }
        })
    }
};
