document.getElementById('logout-button').addEventListener('click', async function() {
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                localStorage.removeItem('token');

                window.location.href = 'login.html';
            } else {
                console.error('Error al cerrar sesión:', await response.json());
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    }
});