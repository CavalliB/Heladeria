// Array para almacenar los sabores seleccionados
let saboresSeleccionados = [];

// Array para mantener el orden de las cookies
let ordenCookies = [];

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
    // Obtener la medida desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const medida = urlParams.get('medida'); // Ejemplo: "1/4", "1/2", "1kg"

    // Crear una cookie con los sabores seleccionados
    const sabores = saboresSeleccionados.sort().join(','); // Convierte el array en una cadena separada por comas y ordenada
    const cookieNombre = `Helado_${btoa(sabores + medida).replace(/=+$/, '')}`; // Usa Base64 para generar un nombre único y elimina el relleno `=`
    const valorCookie = `${sabores}|${medida}`; // Incluye los sabores y la medida en el valor de la cookie

    // Llamar a la función para crear la cookie
    crearCookieHelado(cookieNombre, valorCookie, 1); // La cookie será válida por 1 día

    alert(`Sabores seleccionados: ${sabores}\nMedida: ${medida}`);
    console.log(`Cookie creada: ${cookieNombre}=${valorCookie}`);

    // Redirigir al carrito
    window.location.href = 'ShoppingCart.html';
}

function crearCookieHelado(nombre, valor, dias) {
    let cookieActual = getCookie(nombre);
    let cantidad = 1; // Valor inicial

    if (cookieActual) {
        // Si la cookie ya existe, extraer la cantidad actual y sumarle 1
        const [sabores, medida, cantidadActual] = cookieActual.split('|');
        cantidad = parseInt(cantidadActual) + 1;
        valor = `${sabores}|${medida}`; // Mantener los sabores y medida originales
    }

    // Crear o actualizar la cookie con el nuevo valor y cantidad
    let expiracion = generarFechaExpiracion(dias);
    document.cookie = `${nombre}=${valor}|${cantidad}; ${expiracion}; path=/`;

    console.log(`Cookie creada o actualizada: ${nombre}=${valor}|${cantidad}`);
}

// Función para crear una cookie de producto
function crearCookieProducto(nombre, valorInicial, dias) {
    // Obtener el valor actual de la cookie
    let valorActual = parseInt(getCookie(nombre)) || 0; // Si no existe, inicializa en 0

    // Incrementar el valor actual con el valor inicial
    let nuevoValor = valorActual + parseInt(valorInicial);

    // Crear o actualizar la cookie con el nuevo valor
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

    // Si el array de orden está vacío, llenarlo con las claves de las cookies
    if (ordenCookies.length === 0) {
        ordenCookies = cookies.map(cookie => cookie.split('=')[0]); // Extrae las claves de las cookies
    }

    // Limpia el contenido actual de la tabla
    tablaBody.innerHTML = '';

    // Itera sobre el array de orden y genera filas
    ordenCookies.forEach((clave, index) => {
        const valorCompleto = getCookie(clave); // Obtiene el valor de la cookie
        if (!valorCompleto) return; // Si la cookie no existe, la ignoramos

        let cantidad = 1;

        // Verifica si la cookie incluye el separador `|`
        if (valorCompleto.includes('|')) {
            // Caso: Helados
            const partes = valorCompleto.split('|');
            cantidad = parseInt(partes[2]) || 1; // Cantidad
        } else {
            // Caso: Productos
            cantidad = parseInt(valorCompleto) || 1; // La cantidad es el valor de la cookie
        }

        // Decodifica el nombre de la cookie si es Base64 (para helados)
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

        // Crea una nueva fila con un cuadro de texto para la cantidad
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td class="col-nombre">
                ${nombreLegible}
            </td> <!-- Producto -->
            <td>
                <button class="btn btn-sm btn-danger" onclick="modificarCantidad('${clave}', -1)">-</button>
                <input type="number" class="form-control form-control-sm d-inline-block" 
                        value="${cantidad}" 
                        min="1" 
                        maxlength="4" 
                        style="width: 60px;" 
                        data-clave="${clave}"
                        onchange="actualizarCantidadAbsoluta('${clave}', this.value)">
                <button class="btn btn-sm btn-success" onclick="modificarCantidad('${clave}', 1)">+</button>
            </td> <!-- Cantidad -->
            <td>${precioTotal}$</td> <!-- Precio -->
        `;

        // Agrega la fila al cuerpo de la tabla
        tablaBody.appendChild(fila);
    });
}


function modificarCantidad(nombre, cambio) {
    // Obtener el valor actual de la cookie
    let cookieActual = getCookie(nombre);
    if (!cookieActual) return; // Si no existe la cookie, no hacemos nada

    let valor, cantidad;

    // Verifica si la cookie incluye el separador `|`
    if (cookieActual.includes('|')) {
        // Caso: Helados
        const partes = cookieActual.split('|'); // Divide el valor en partes
        valor = partes.slice(0, -1).join('|'); // Mantiene todo excepto la cantidad
        cantidad = parseInt(partes[partes.length - 1]) || 0; // Obtiene la cantidad
    } else {
        // Caso: Productos
        valor = nombre; // El nombre del producto es el identificador
        cantidad = parseInt(cookieActual) || 0; // La cantidad es el valor de la cookie
    }

    // Obtener el valor actual del cuadro de texto
    const inputCantidad = document.querySelector(`input[data-clave="${nombre}"]`);
    const cantidadActualInput = parseInt(inputCantidad.value) || 0;

    // Modificar la cantidad usando el valor del cuadro de texto
    cantidad = cantidadActualInput + cambio;

    // Si la cantidad es menor a 1, eliminamos la cookie
    if (cantidad < 1) {
        document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    } else {
        // Actualizar la cookie con el nuevo valor y cantidad
        let expiracion = generarFechaExpiracion(1); // 1 día de expiración
        if (cookieActual.includes('|')) {
            // Para helados
            document.cookie = `${nombre}=${valor}|${cantidad}; ${expiracion}; path=/`;
        } else {
            // Para productos
            document.cookie = `${nombre}=${cantidad}; ${expiracion}; path=/`;
        }
    }
    // Actualizar el valor del cuadro de texto
    inputCantidad.value = cantidad;

    // Recargar la tabla para reflejar los cambios
    mostrarCookiesEnTabla();
}

function actualizarCantidadAbsoluta(nombre, nuevaCantidad) {
    nuevaCantidad = parseInt(nuevaCantidad);

    // Validar que la cantidad sea un número válido y mayor a 0
    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
        alert('Por favor, ingresa un número válido mayor a 0.');
        mostrarCookiesEnTabla(); // Recargar la tabla para restaurar el valor anterior
        return;
    }

    // Obtener el valor actual de la cookie
    let cookieActual = getCookie(nombre);
    if (!cookieActual) return; // Si no existe la cookie, no hacemos nada

    let valor;

    // Verifica si la cookie incluye el separador `|`
    if (cookieActual.includes('|')) {
        const partes = cookieActual.split('|'); // Divide el valor en partes
        valor = partes.slice(0, -1).join('|'); // Mantiene todo excepto la cantidad
    } else {
        valor = nombre; // El nombre del producto es el identificador
    }

    // Actualizar la cookie con el nuevo valor absoluto
    let expiracion = generarFechaExpiracion(1); // 1 día de expiración
    if (cookieActual.includes('|')) {
        // Para helados
        document.cookie = `${nombre}=${valor}|${nuevaCantidad}; ${expiracion}; path=/`;
    } else {
        // Para productos
        document.cookie = `${nombre}=${nuevaCantidad}; ${expiracion}; path=/`;
    }

    // Recargar la tabla para reflejar los cambios
    mostrarCookiesEnTabla();
}