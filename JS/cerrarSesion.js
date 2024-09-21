document.getElementById('logout-button').addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:8000/api/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        } else {
            const errorText = await response.text();
            console.error('Error al cerrar sesión:', errorText);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
});
