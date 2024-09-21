document.addEventListener('DOMContentLoaded', () => {
    verificarToken();

    function verificarToken() {
        const token = localStorage.getItem('token');
        if (token) {
            console.log('El token está presente:', token);
        } else {
            console.error('No se encontró el token.');
            window.location.href = 'login.html';
        }
    }
});