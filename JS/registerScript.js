document.querySelector('.register-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nombreCompleto = document.getElementById('Nombre_Completo').value;
    const nombreUsuario = document.getElementById('Nombre_de_Usuario').value;
    const correo = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const fechaNacimiento = document.getElementById('Fecha_De_Nacimiento').value;

    try {
        const response = await fetch('http://127.0.0.1:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Nombre_Completo: nombreCompleto,
                Nombre_de_Usuario: nombreUsuario,
                Correo: correo,
                password: password,
                password_confirmation: password,
                Fecha_De_Nacimiento: fechaNacimiento,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registro exitoso');
            window.location.href = 'login.html';
        } else {
            alert(data.message || 'Error en el registro');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al registrar el usuario');
    }
});