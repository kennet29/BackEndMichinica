document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente

    // Obtener los valores del formulario
    const correo = document.querySelector('[name="correo"]').value;
    const contraseña = document.querySelector('[name="contraseña"]').value;

    // Verificar si los campos están vacíos
    if (correo.trim() === '' || contraseña.trim() === '') {
        alert('Por favor, completa todos los campos.'); // Muestra una alerta de advertencia
        return; // Detiene la ejecución del script si los campos están vacíos
    }

    // Crear un objeto con los datos
    const data = {
        correo: correo,
        contraseña: contraseña
    };

    // Enviar una solicitud POST al controlador
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json()) // Parsea la respuesta JSON
    .then(data => {
        if (data.token) {
            // Almacena el token en el almacenamiento local (localStorage) de forma segura
            localStorage.setItem('token', data.token);

            // Redirigir a la página principal u otra página de éxito
            window.location.href = '/index'; // Cambia esto según tu estructura de rutas
        } else {
            // Manejar errores de inicio de sesión aquí
            alert('Usuario o contraseña incorrectos.'); // Muestra una alerta si la autenticación falla
            console.error('Error en el inicio de sesión');
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });
});
