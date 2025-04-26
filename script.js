
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
