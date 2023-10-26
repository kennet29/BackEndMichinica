// Función para cargar datos actuales de la configuración desde la URL
async function cargarDatosActuales() {
    try {
        const response = await fetch('http://localhost:3000/configuraciones'); // URL de donde vienen los datos
        if (!response.ok) {
            throw new Error('No se pudieron cargar los datos.');
        }
        const data = await response.json();
  
        // Llena los campos del formulario con los datos obtenidos
        const config = data[0]; // Suponemos que el registro que deseas editar es el primero
        document.getElementById('direccion').value = config.direccion;
        document.getElementById('correoElectronico').value = config.correoElectronico;
        document.getElementById('telefono1').value = config.telefono1;
        document.getElementById('telefono2').value = config.telefono2;
        document.getElementById('eslogan').value = config.eslogan;
        document.getElementById('tipoDeCambio').value = config.tipoDeCambio;
    } catch (error) {
        console.error(error);
    }
  }
  
  // Función para guardar cambios en la configuración
  async function guardarCambios() {
    const form = document.getElementById("configForm");
    const formData = new FormData(form);
  
    try {
        const response = await fetch('http://localhost:3000/configuraciones/1', {
            method: 'PUT',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'Content-Type': 'application/json'
            }
        });
  
        if (!response.ok) {
            throw new Error('No se pudieron guardar los cambios.');
        }
  
        const mensaje = document.getElementById('mensaje');
  
        alert("Cambios Realizados");
  
    } catch (error) {
        console.error(error);
        const mensaje = document.getElementById('mensaje');
        mensaje.textContent = 'Error al guardar los cambios.';
        mensaje.style.color = 'red';
    }
  }
  
  // Cargar los datos actuales cuando se cargue la página
  window.onload = function() {
    cargarDatosActuales();
  };
  