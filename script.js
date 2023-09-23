// Espera a que el contenido del DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function(){
    
    // Se inicializan las variables
    var valor_intentos_restantes = 7;  // Número de intentos restantes permitidos
    var intentos_anteriores = [];  // Array para almacenar los intentos anteriores del usuario
    
    // Se obtienen los elementos necesarios del DOM
    const numero_secreto = dame_numero_entre_1_y_100();  // Número secreto generado aleatoriamente
    const contenedor = document.getElementById("contenedor");
    const numero_usuario = document.getElementById("txt_numero");
    const boton = document.getElementById("btn_comprobar");
    const intentos_restantes = document.getElementById("out_intentos_restantes");
    const mensaje = document.getElementById("out_mensajes");
    const lista_intentos_anteriores = document.getElementById("ul_intentos_anteriores");
    
    const sonido_general = new Audio('game.mp3');  // Audio para el juego
    var cancelar_sonido = false;  // Variable de control para pausar o reproducir el sonido

    // Función para generar un número aleatorio entre 1 y 100
    function dame_numero_entre_1_y_100(){
        return Math.trunc((Math.random() * 100) + 1);
    }
    
    // Función para actualizar la visualización de intentos restantes
    function actualizar_intentos_restantes() {
        intentos_restantes.innerHTML = valor_intentos_restantes;
    }
    
    // Función para reproducir un sonido específico
    function reproducirSonido(src) {
        const audio = new Audio(src);
        audio.play();
    }

    // Función para actualizar la lista de intentos anteriores en el DOM
    function actualizarListaIntentos() {
        // Limpia la lista de intentos anteriores
        while (lista_intentos_anteriores.firstChild) {
            lista_intentos_anteriores.removeChild(lista_intentos_anteriores.firstChild);
        }
        // Recorre los intentos anteriores y crea elementos <li> para cada uno
        intentos_anteriores.forEach(intent => {
            const listItem = document.createElement("li");
            listItem.textContent = intent + " 🔍";
            lista_intentos_anteriores.appendChild(listItem);
        });
    }
    
    // Actualiza los intentos restantes al inicio
    actualizar_intentos_restantes();
 
    // Controla la reproducción/pausa del sonido al hacer click en el contenedor
    contenedor.addEventListener("click", function(){
        if (cancelar_sonido) {
            sonido_general.pause();
        } else {
            sonido_general.play();
            sonido_general.loop = true;
        }       
    });

    // Prevención del comportamiento de envío predeterminado del formulario
    document.getElementById("formulario").addEventListener('submit', (event) => {
        event.preventDefault();
    });

    // Evento de click para el botón de comprobación
    boton.addEventListener("click", function(){
        let valor_numero_usuario = parseInt(numero_usuario.value);  // Se obtiene el valor del usuario
        if(isNaN(valor_numero_usuario) || valor_numero_usuario < 1 || valor_numero_usuario > 100) {
            mensaje.innerHTML = "Por favor, introduce un número válido entre 1 y 100.";  // Valida la entrada del usuario
            return;
        }        
        valor_intentos_restantes--;  // Resta uno a los intentos restantes
        actualizar_intentos_restantes();  // Actualiza la visualización de intentos restantes
        
        // Comprueba si el usuario adivinó el número secreto
        if (valor_numero_usuario === numero_secreto){
            mensaje.innerHTML = "¡¡¡Ganaste!!! 🎉";
            cancelar_sonido = true;
            sonido_general.pause();
            reproducirSonido('you_win.wav');
            contenedor.classList.add("negrear_fondo");
            mensaje.classList.add("animar_ganador");
        } else {
            // Comprueba si los intentos se han agotado
            if (valor_intentos_restantes == 0) {
                boton.disabled = true;
                mensaje.innerHTML = "Perdiste 😞";
                cancelar_sonido = true;
                sonido_general.pause();
                reproducirSonido('game_over.wav');
            } else {
                // Si aún quedan intentos, proporciona una pista y registra el intento
                reproducirSonido('fail.mp3');
                mensaje.innerHTML = valor_numero_usuario > numero_secreto ? 
                    "Pista: El número es MENOR que el que pusiste" : "Pista: El número es MAYOR que el que pusiste";
                intentos_anteriores.push(valor_numero_usuario);
                actualizarListaIntentos();
            }
        }   
    });
});
