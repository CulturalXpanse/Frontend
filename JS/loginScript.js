document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://127.0.0.1:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Correo: email,
                password: password
            })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);

            window.location.href = 'inicio.html';
        } else {
            const errorData = await response.json();
            document.getElementById('mensaje-error').innerText = errorData.message;
            document.getElementById('mensaje-error').style.display = 'block';
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
});