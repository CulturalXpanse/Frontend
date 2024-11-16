let commentModal;
let closeModal;
let submitComment;
let commentInput;

document.addEventListener('DOMContentLoaded', () => {
    commentModal = document.getElementById("commentModal");
    closeModal = document.getElementById("closeModalComentario");
    submitComment = document.getElementById("submitComment");
    commentInput = document.getElementById("commentInput");

    // Cierra el modal al hacer clic en la 'X'
    closeModal.addEventListener('click', () => {
        commentModal.style.display = "none";
    });

    // Cierra el modal al hacer clic fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === commentModal) {
            commentModal.style.display = "none";
        }
    });

    // Cierra el modal al presionar "Escape"
    window.addEventListener('keydown', (event) => {
        if (event.key === "Escape") {
            commentModal.style.display = "none";
        }
    });
});

// Función para cargar los comentarios de un post
function cargarComentarios(postId) {
    const token = localStorage.getItem('accessToken');

    fetch(`http://localhost:8001/api/posts/${postId}/comentarios`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(comentarios => {

        const comentariosContainer = document.getElementById('comentariosContainer');
        comentariosContainer.innerHTML = ''; // Limpiar los comentarios anteriores

        comentarios.forEach(comentario => {

            const imgSrcPerfil = comentario.user.foto_perfil
            ? `http://localhost:8000/imagenes/perfiles/${comentario.user.foto_perfil}`
            : 'default-profile.png';

            const comentarioElement = document.createElement('div');
            comentarioElement.classList.add('comentario');
            comentarioElement.innerHTML = `
                <div class="comentario-usuario">
                    <div class="foto-perfil-container">
                        <img src="${imgSrcPerfil}" class="foto-perfil" alt="Foto de Perfil"/>
                    </div>
                    <div class="informacion-usuario">
                        <div class="usuario-nombre">
                            <p id="nombre-usuario">${comentario.user.name}</p>
                        </div>
                        <div class="fecha-comentario">
                            <span id="fechaPublicacion">${comentario.created_at}</span>
                        </div>
                        <div class="contenido-comentario">
                            <p class="contenido">${comentario.contenido}</p>
                        </div>
                    </div>
                </div>
            `;
            comentariosContainer.appendChild(comentarioElement);
        });
    })
    .catch(error => {
        console.error('Error al cargar los comentarios:', error);
    });
}

// Evento para el envío del comentario
document.getElementById('submitComment').addEventListener('click', async () => {
    const commentInput = document.getElementById('commentInput');
    const postId = window.currentPostId;
    const userId = await getUserId();
    const token = localStorage.getItem('accessToken');

    if (!postId || !userId) {
        alert('El postId o el userId no son válidos.');
        return;
    }

    if (commentInput.value.trim() === '') {
        alert('Por favor, escribe un comentario.');
        return;
    }

    const comentario = {
        post_id: postId,
        user_id: userId,
        contenido: commentInput.value
    };

    fetch('http://localhost:8001/api/comentarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(comentario)
    })
    .then(response => response.json())
    .then(data => {
        commentInput.value = '';
        cargarComentarios(postId);
        obtenerComentariosCount();  // Actualiza el contador de comentarios al agregar uno nuevo
    })
    .catch(error => {
        console.error('Error al guardar el comentario:', error);
    });
});

// Función para abrir el modal de comentarios
function abrirModalComentarios(postId) {
    window.currentPostId = postId;
    cargarComentarios(postId);
    document.getElementById('commentModal').style.display = 'flex';
}

// Función para obtener el id del usuario autenticado
async function getUserId() {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert("No se encontró el token de autenticación.");
        return null;
    }

    try {
        const response = await fetch('http://localhost:8000/api/validate', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            return data.id;
        } else {
            throw new Error('Error al validar el token');
        }
    } catch (error) {
        console.error(error);
        alert("Error al obtener la ID del usuario.");
        return null;
    }
}