document.addEventListener('DOMContentLoaded', () => {
    // Asegúrate de que el modal esté oculto al cargar la página
    const modal = document.getElementById('shareModal');
    modal.style.display = 'none';

    // Obtener los demás elementos
    const openModalBtn = document.getElementById('openShareModal');
    const closeModalBtn = document.getElementById('closeShareModal');

    // Abrir modal al hacer clic en el botón de compartir
    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    // Cerrar modal al hacer clic en la 'x'
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cerrar modal al hacer clic fuera del contenido del modal
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});
