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
    // Crear una cookie con los sabores seleccionados
    const sabores = saboresSeleccionados.sort().join(','); // Convierte el array en una cadena separada por comas y ordenada
    const cookieNombre = `Helado_${btoa(sabores)}`; // Usa Base64 para generar un nombre único

    // Crear una cookie con la combinación de sabores
    crearCookieHelado(cookieNombre, sabores, 1); // La cookie será válida por 1 día

    alert(`Sabores seleccionados: ${sabores}`);
    console.log(`Cookie creada: SaboresSeleccionados=${sabores}`);
}

function crearCookieHelado(nombre, valor, dias) {
    // Obtener el valor actual de la cookie (si existe)
    let cookieActual = getCookie(nombre);
    let cantidad = 1; // Valor inicial

    if (cookieActual) {
        // Si la cookie ya existe, extraer la cantidad actual y sumarle 1
        const [sabores, cantidadActual] = cookieActual.split('|');
        cantidad = parseInt(cantidadActual) + 1;
        valor = sabores; // Mantener los sabores originales
    }

    // Crear o actualizar la cookie con el nuevo valor y cantidad
    let expiracion = generarFechaExpiracion(dias);
    document.cookie = `${nombre}=${valor}|${cantidad}; ${expiracion}; path=/`;

    console.log(`Cookie creada o actualizada: ${nombre}=${valor}|${cantidad}`);
}

// Función para crear una cookie de producto
function crearCookieProducto(nombre, valorInicial, dias) {
    // Obtener el valor actual de la cookie
    let valorActual = parseInt(getCookie(nombre)) || 0;

    // Incrementar el valor
    let nuevoValor = valorActual + parseInt(valorInicial);

    // Crear o actualizar la cookie
    let expiracion = generarFechaExpiracion(dias);
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
function generarFechaExpiracion(dias) {
    let fecha = new Date();
    fecha.setTime(fecha.getTime() + (dias * 24 * 60 * 60 * 1000)); // Días a milisegundos
    return "expires=" + fecha.toUTCString();
}


// Llama a la función cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('ShoppingCart.html')) {
        mostrarCookiesEnTabla(); // Llama a la función para mostrar las cookies en la tabla
    }
});

function mostrarCookiesEnTabla() {
    const cookies = document.cookie.split('; '); // Obtiene todas las cookies
    const tablaBody = document.querySelector('table tbody'); // Selecciona el cuerpo de la tabla

    // Limpia el contenido actual de la tabla
    tablaBody.innerHTML = '';

    // Itera sobre las cookies y genera filas
    cookies.forEach((cookie, index) => {
        const [clave, valorCompleto] = cookie.split('='); // Divide la cookie en clave y valor
        let valor, cantidad;

        // Verifica si la cookie incluye el separador `|`
        if (valorCompleto && valorCompleto.includes('|')) {
            [valor, cantidad] = valorCompleto.split('|'); // Divide el valor en sabores y cantidad
            cantidad = parseInt(cantidad) || 1; // Asegura que la cantidad sea un número
        } else {
            valor = valorCompleto || ''; // Si no hay `|`, todo el valor corresponde a los sabores
            cantidad = parseInt(valorCompleto) || 1; // Intenta interpretar el contenido como cantidad
        }

        // Decodifica el nombre de la cookie si es Base64
        let nombreLegible = clave;
        if (clave.startsWith('Helado_')) {
            try {
                nombreLegible = atob(clave.replace('Helado_', '')); // Decodifica el nombre
            } catch (e) {
                console.error('Error al decodificar el nombre de la cookie:', clave);
            }
        }

        // Calcula el precio total (por ejemplo, $15 por unidad)
        const precioPorUnidad = 15;
        const precioTotal = cantidad * precioPorUnidad;

        // Crea una nueva fila
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${nombreLegible}</td> <!-- Producto -->
            <td>${cantidad}</td> <!-- Cantidad -->
            <td>$${precioTotal}</td> <!-- Precio -->
        `;

        // Agrega la fila al cuerpo de la tabla
        tablaBody.appendChild(fila);
    });
}