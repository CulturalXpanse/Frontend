let isEmailSubmitted = false; // Variable para rastrear si el email ya fue enviado

document.querySelector(".register-form").addEventListener("submit", async function(e) {
    e.preventDefault(); // Evita el comportamiento por defecto de enviar el formulario

    if (!isEmailSubmitted) {
        // Si no se ha enviado el email, primero manejamos la validación del email
        const email = document.getElementById('email').value;

        // Simula una validación exitosa con Laravel (deberías hacer una petición AJAX real)
        // Aquí deberías enviar una solicitud para validar el correo electrónico.

        // Si es válido, cambia el formulario
        document.querySelector(".register-form").innerHTML = `
            <label for="old-password">Contraseña anterior</label>
            <input type="password" id="old-password" required>

            <label for="new-password">Nueva contraseña</label>
            <input type="password" id="new-password" required>

            <label for="confirm-password">Repetir nueva contraseña</label>
            <input type="password" id="confirm-password" required>

            <span class="mensaje-error">Mensaje de error en caso de ingresar datos incorrectos</span>

            <button type="submit">Confirmar</button>
        `;

        isEmailSubmitted = true; // Cambia el estado para saber que ya hemos validado el email
    } else {
        // Si el email ya ha sido validado, manejamos el cambio de contraseña

        const oldPassword = document.getElementById('old-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Verificar que la nueva contraseña y la confirmación coincidan
        if (newPassword !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword,
                    new_password_confirmation: confirmPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                window.location.href = "/login"; // Redirigir al login
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
});