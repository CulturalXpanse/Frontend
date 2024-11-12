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

document.addEventListener('DOMContentLoaded', () => {
    obtenerPerfilUsuario();
});

// Logica para cambiar entre pestañas del perfil
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
    });
});

async function obtenerPerfilPorId() {
    // Obtiene el ID del usuario desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    
    if (!userId) {
        alert('No se encontró el ID del usuario.');
        return;
    }

    try {
        // Realiza la solicitud para obtener el perfil del usuario
        const response = await fetch(`http://localhost:8000/api/perfil/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener el perfil del usuario');
        }

        const data = await response.json();

        // Llenar los datos en la página
        document.querySelector('.nombrePerfil').textContent = data.name;
        document.querySelector('.nombre-completoPerfil').textContent = data.nombre_completo;
        document.querySelector('.ciudadPerfil').textContent = data.ciudad;
        document.querySelector('.paisPerfil').textContent = data.pais;
        document.querySelector('.fecha-nacimientoPerfil').textContent = data.fecha_nacimiento;
        document.querySelector('.user-bioPerfil.biografia').textContent = data.biografia;

        const fotoPerfil = data.foto_perfil || 'perfilDefault.png';
        const imgSrc = `http://localhost:8000/imagenes/perfiles/${fotoPerfil}`;

        const fotoPerfilElements = document.querySelectorAll('.fotoOtroPerfil');
        fotoPerfilElements.forEach(img => {
            img.src = imgSrc;
        });

        cargarPostsPerfilOtro(userId);

    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al cargar el perfil.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    obtenerPerfilPorId();
});

async function cargarPostsPerfilOtro(usuarioId) {
    try {
        const response = await fetch(`http://localhost:8001/api/posts/usuario/${usuarioId}`);

        if (!response.ok) {
            console.error('Error al cargar los posts:', response);
            throw new Error('Error al cargar los posts del perfil');
        }

        const posts = await response.json();

        const postsContainer = document.querySelector('.columna-postOtroPerfil');
        postsContainer.innerHTML = '';

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post-container';
            postElement.id = `post-${post.id}`;

            const imgSrcPerfil = post.user && post.user.foto_perfil
                ? `http://localhost:8000/imagenes/perfiles/${post.user.foto_perfil}`
                : 'default-profile.png';
            const userName = post.user && post.user.name ? post.user.name : 'Usuario desconocido';
            const fecha = post.created_at;

            postElement.innerHTML = `
                <div class="post-row">
                    <div class="user-profile">
                        <div class="profile-pic-container">
                            <img src="${imgSrcPerfil}" class="fotoPerfil" alt="Foto de Perfil"/>
                        </div>
                        <div class="user-info">
                            <p id="nombreUsuario">${userName}</p>
                            <span id="fechaPublicacion">${fecha}</span>
                        </div>
                    </div>
                    <div class="menuDots">
                        <a class="dots" style="cursor: pointer;"><i class="fa-solid fa-ellipsis"></i></a>
                        <div class="dropdown-contentDots">
                            <a href="../HTML/perfil.html">Ver perfil</a>
                        </div>
                    </div>
                </div>
            `;

            // Detectar si el título contiene un enlace de YouTube y extraer el videoID
            let postContent = post.titulo;
            const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?/;
            const youtubeMatch = postContent.match(youtubeRegex);

            if (youtubeMatch) {
                // Extraer el videoID y eliminar el enlace de YouTube del texto
                const videoId = youtubeMatch[1];
                postContent = postContent.replace(youtubeRegex, ''); // Quitar el enlace

                // Agregar el texto sin el enlace
                postElement.innerHTML += `<p class="post-text">${postContent.trim()}</p>`;

                // Agregar el video de YouTube
                postElement.innerHTML += `
                    <div class="post-media-container">
                        <iframe class="post-media" width="100%" height="400" 
                            src="https://www.youtube.com/embed/${videoId}" 
                            frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen></iframe>
                    </div>
                `;
            } else {
                // Si no es un enlace de YouTube, agregar el texto del post
                postElement.innerHTML += `<p class="post-text">${postContent}</p>`;
            }

            // Agregar imagen o video del post
            if (post.contenido) {
                const extension = post.contenido.split('.').pop().toLowerCase();
                if (['mp4', 'webm', 'ogg'].includes(extension)) {
                    postElement.innerHTML += `
                        <video class="post-media" controls>
                            <source src="http://localhost:8001/imagenes/posts/${post.contenido}" type="video/${extension}">
                            Tu navegador no soporta la reproducción de este video.
                        </video>
                    `;
                } else {
                    postElement.innerHTML += `
                    <div class="post-img-container">
                        <img src="http://localhost:8001/imagenes/posts/${post.contenido}" class="post-img" alt="Imagen Post">
                    </div>
                    `;
                }
            }

            postElement.innerHTML += `
                <div class="post-row">
                    <div class="activity-icons">
                        <div>
                            <i id="likeBtn-${post.id}" class="fa-regular fa-thumbs-up fa-xl icono" onclick="toggleLike(${post.id})"></i>
                            <span id="likeCount-${post.id}">0</span>
                        </div>   
                        <div>
                            <i id="openCommentModal-${post.id}" class="fa-solid fa-comment fa-xl icono" onclick="abrirModalComentarios(${post.id})"></i>
                            <span id="comentariosCount_${post.id}">0</span>
                        </div>
                        <div>
                            <i id="openShareModal" class="fa-solid fa-share fa-xl icono" onclick="openShareModal()"></i>
                        </div>
                    </div>
                </div>
            `;

            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error al cargar los posts:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('id');

    
    if (!profileId) {
        alert('No se encontró el ID del usuario.');
        return;
    }

    // Obtener el ID del usuario actual
    let userId;
    try {
        const response = await fetch('http://localhost:8000/api/usuario/actual', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        const userData = await response.json();
        userId = userData.id;
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al cargar el usuario actual.');
        return;
    }

    // Llamar a la función para verificar la amistad
    verificarAmistad(userId, profileId);
    obtenerAmigos(profileId);
});

async function verificarAmistad(userId, profileId) {
    try {
        const response = await fetch(`http://localhost:8000/api/verificar-amistad/${userId}/${profileId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al verificar la amistad');
        }

        const data = await response.json();
        const esAmigo = data.sonAmigos;

        // Selecciona el contenedor donde se mostrará el botón de amistad
        const amistadContainer = document.querySelector('.amistad-container');
        amistadContainer.innerHTML = '';

        // Crea el botón basado en la relación de amistad
        let botonAmistad;
        if (esAmigo) {
            botonAmistad = document.createElement('button');
            botonAmistad.id = 'openModalEditPerfilBtn';
            botonAmistad.className = 'opciones_O_anadir';
            botonAmistad.innerHTML = '<i class="fa-solid fa-gear"></i>';
        } else {
            botonAmistad = document.createElement('button');
            botonAmistad.id = 'openModalEditPerfilBtn';
            botonAmistad.className = 'opciones_O_anadir';
            botonAmistad.textContent = 'Añadir amigo';
        }

        amistadContainer.appendChild(botonAmistad);
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al verificar la amistad.');
    }
}

async function obtenerAmigos(usuarioId) {

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
        console.log('Amigos:', amigos);

        // Mostrar los amigos en el HTML
        mostrarAmigos(amigos);
    } catch (error) {
        console.error('Error al obtener los amigos:', error);
    }
}

// Función para mostrar los amigos en el HTML
function mostrarAmigos(amigos) {
    const listaAmigos = document.querySelector('.amigos-listOtro');

    amigos.forEach(amigo => {
        const amigoElement = document.createElement('div');
        amigoElement.classList.add('amigos');
        amigoElement.id = `${amigo.id}`;

        // Obtener la URL de la foto de perfil
        const imgSrcPerfil = amigo.foto_perfil
            ? `http://localhost:8000/imagenes/perfiles/${amigo.foto_perfil}`
            : 'default-profile.png';

        // Obtener el nombre del amigo
        const userName = amigo.name ? amigo.name : 'Usuario desconocido';

        // Crear el HTML para mostrar el amigo
        amigoElement.innerHTML = `
            <div class="foto-perfil-container">
                <img src="${imgSrcPerfil}" class="foto-perfil" alt="Foto de perfil de ${userName}"/>
            </div>
            <a><p>${userName}</p><i class="fa-solid fa-message"></i></a>
        `;

        // Agregar el amigo a la lista
        listaAmigos.appendChild(amigoElement);
    });
}

// Llamar a la función cuando la página se haya cargado
document.addEventListener('DOMContentLoaded', () => {
    obtenerAmigos(); // Cargar los amigos cuando la página esté lista
});