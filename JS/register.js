document.querySelector('.register-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nombreCompleto = document.getElementById('Nombre_Completo').value;
    const nombreUsuario = document.getElementById('Nombre_de_Usuario').value;
    const correo = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const fechaNacimiento = document.getElementById('Fecha_De_Nacimiento').value;

    try {
        const response = await fetch('http://localhost:8000/api/register', {
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
                client_id : "1",
                client_secret : "yUr2KXmywzZQECxyc2VHqNBcn1lbH7VSauwQqFAp",
            }),
        });

        if (response.ok) {
            const data = await response.json();
            mostrarModalExito();
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message || 'Error en el registro'}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al registrar el usuario');
    }
});

function mostrarModalExito() {
    const modal = document.getElementById('registroExitosoModal');
    const closeBtn = document.querySelector('.closeRegistro');
    const okBtn = document.getElementById('cerrarModalRegistro');

    modal.style.display = 'flex';

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        window.location.href = 'login.html';
    });

    okBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        window.location.href = 'login.html';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            window.location.href = 'login.html';
        }
    });
}