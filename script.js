// Array para almacenar los sabores seleccionados
let saboresSeleccionados = [];

// Función para manejar la selección de sabores
function seleccionar(sabor, elemento) {
    const card = elemento.closest('.card'); // Obtiene la tarjeta correspondiente

    // Verifica si el sabor ya está seleccionado
    if (saboresSeleccionados.includes(sabor)) {
        // Si ya está seleccionado, lo quitamos
        saboresSeleccionados = saboresSeleccionados.filter(item => item !== sabor);
        card.classList.remove('seleccionada');
    } else {
        // Si no está seleccionado y hay menos de 3 sabores, lo agregamos
        if (saboresSeleccionados.length < 3) {
            saboresSeleccionados.push(sabor);
            card.classList.add('seleccionada');
        } else {
            alert('Solo puedes seleccionar hasta 3 sabores.');
            return;
        }
    }

    // Habilitar o deshabilitar el botón "Continuar"
    document.getElementById('continuarBtn').disabled = saboresSeleccionados.length === 0;
}

// Función para continuar
function continuar() {
    alert(`Sabores seleccionados: ${saboresSeleccionados.join(', ')}`);
    // Aquí puedes redirigir al usuario o realizar otra acción
}

// Función para crear una cookie
function crearCookie(nombre, valorInicial, dias) {
    // Obtener el valor actual de la cookie
    let valorActual = parseInt(getCookie(nombre)) || 0;

    // Incrementar el valor
    let nuevoValor = valorActual + parseInt(valorInicial);

    // Crear o actualizar la cookie
    let fecha = new Date();
    fecha.setTime(fecha.getTime() + (dias * 24 * 60 * 60 * 1000)); // Días a milisegundos
    let expiracion = "expires=" + fecha.toUTCString();
    document.cookie = `${nombre}=${nuevoValor}; ${expiracion}; path=/`;

    console.log(`Cookie actualizada: ${nombre}=${nuevoValor}`);
}

// Función para obtener el valor de una cookie
function getCookie(nombre) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === nombre) {
            return value;
        }
    }
    return null;
}
