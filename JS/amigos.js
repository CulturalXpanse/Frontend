async function obtenerUsuarioId() {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:8000/api/validate', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('No se pudo obtener el ID del usuario');
        }

        const data = await response.json();
        return data.id;
    } catch (error) {
        console.error('Error al obtener el ID del usuario:', error);
        return null;
    }
}

async function obtenerAmigos() {
    const usuarioId = await obtenerUsuarioId();

    if (!usuarioId) {
        console.error('No se pudo obtener el ID del usuario');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8000/api/usuarios/${usuarioId}/amigos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('No se pudieron obtener los amigos');
        }

        const amigos = await response.json();

        mostrarAmigos(amigos);
    } catch (error) {
        console.error('Error al obtener los amigos:', error);
    }
}

function mostrarAmigos(amigos) {
    const listaAmigos = document.querySelector('.amigos-list');

    amigos.forEach(amigo => {
        const amigoElement = document.createElement('div');
        amigoElement.classList.add('amigos');
        amigoElement.id = `${amigo.id}`;

        const imgSrcPerfil = amigo.foto_perfil
            ? `http://localhost:8000/imagenes/perfiles/${amigo.foto_perfil}`
            : '../Img/default-profile.png';

        const userName = amigo.name ? amigo.name : 'Usuario desconocido';

        amigoElement.innerHTML = `
            <div class="foto-perfil-container">
                <img src="${imgSrcPerfil}" class="foto-perfil"/>
            </div>
            <a><p>${userName}</p><i class="fa-solid fa-message"></i></a>
        `;

        listaAmigos.appendChild(amigoElement);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    obtenerAmigos();
});