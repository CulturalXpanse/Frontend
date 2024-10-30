async function obtenerPerfilUsuario() {
    try {
        const response = await fetch('http://localhost:8000/api/usuario/actual', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener el perfil');
        }

        const data = await response.json();

        document.querySelector('.nombre-usuario').textContent = data.name;

        const fotoPerfil = data.foto_perfil || 'perfilDefault.png';
        const imgSrc = `http://localhost:8000/imagenes/perfiles/${fotoPerfil}`;

        const fotoPerfilElements = document.querySelectorAll('.fotoPerfil');
        fotoPerfilElements.forEach(img => {
            img.src = imgSrc;
        });

    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al cargar el perfil.');
    }
}

document.addEventListener('DOMContentLoaded', obtenerPerfilUsuario);
