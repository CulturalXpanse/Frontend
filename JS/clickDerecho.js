document.addEventListener('DOMContentLoaded', () => {
    const friendList = document.querySelector('.amigos-list');
    const contextMenu = document.getElementById('context-menu');
    let selectedUserId = null;

    // Muestra el menú al hacer clic derecho
    friendList.addEventListener('contextmenu', function(e) {
    e.preventDefault();

      // Verifica si el elemento clickeado es un amigo
    if (e.target.closest('.amigos')) {
        const amigo = e.target.closest('.amigos');
        selectedUserId = amigo.getAttribute('data-user-id');
        contextMenu.style.display = 'block';
        contextMenu.style.top = `${e.pageY}px`;
        contextMenu.style.left = `${e.pageX}px`;
    }
    });

    // Oculta el menú si se hace clic afuera
    document.addEventListener('click', () => {
    contextMenu.style.display = 'none';
    });

    // Lógica para "Ver perfil"
    document.getElementById('view-profile').addEventListener('click', () => {
    if (selectedUserId) {
        window.location.href = `perfil-amigo.html`; //${selectedUserId}
    }
    });
});