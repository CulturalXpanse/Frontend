let isEmailSubmitted = false; // Variable para rastrear si el email ya fue enviado

document.querySelector(".password-reset-form").addEventListener("submit", async function(e) {
    e.preventDefault(); // Evita el comportamiento por defecto de enviar el formulario

    const messageElement = document.getElementById('message');

    if (!isEmailSubmitted) {
        // Si no se ha enviado el email, primero manejamos la validación del email
        const email = document.getElementById('email').value;

        try {
            const response = await fetch('/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                // Si el email es válido, cambia el formulario para la nueva contraseña
                document.querySelector(".password-reset-form").innerHTML = `
                    <label for="new-password">Nueva contraseña</label>
                    <input type="password" id="new-password" required>

                    <label for="confirm-password">Repetir nueva contraseña</label>
                    <input type="password" id="confirm-password" required>

                    <div id="message" class="mensaje-error"></div>

                    <button type="submit">Confirmar</button>
                `;
                isEmailSubmitted = true; // Cambia el estado para saber que ya hemos validado el email
            } else {
                // Mostrar el mensaje de error si el email es incorrecto
                messageElement.textContent = data.message;
            }
        } catch (error) {
            console.error("Error:", error);
        }
    } else {
        // Si el email ya ha sido validado, manejamos el cambio de contraseña
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Verificar que la nueva contraseña y la confirmación coincidan
        if (newPassword !== confirmPassword) {
            messageElement.textContent = "Las contraseñas no coinciden";
            return;
        }

        try {
            const response = await fetch('/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    new_password: newPassword,
                    new_password_confirmation: confirmPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                messageElement.textContent = data.message;
                setTimeout(() => {
                    window.location.href = "/login"; // Redirigir al login
                }, 1500); // Esperar 1.5 segundos para mostrar el mensaje
            } else {
                messageElement.textContent = data.message;
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
});