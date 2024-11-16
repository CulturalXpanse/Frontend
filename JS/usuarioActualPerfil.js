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
        document.querySelector('.nombre').textContent = data.name;
        document.querySelector('.nombre-completo').textContent = data.nombre_completo;
        document.querySelector('.ciudad').textContent = data.ciudad;
        document.querySelector('.pais').textContent = data.pais;
        document.querySelector('.fecha-nacimiento').textContent = data.fecha_nacimiento;
        document.querySelector('.user-bio.biografia').textContent = data.biografia;

        const fotoPerfil = data.foto_perfil || 'perfilDefault.png';
        const imgSrc = `http://localhost:8000/imagenes/perfiles/${fotoPerfil}`;

        const fotoPerfilElements = document.querySelectorAll('.fotoPerfil');
        fotoPerfilElements.forEach(img => {
            img.src = imgSrc;
        });

        cargarPostsYEventosPerfil(data.id);

    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al cargar el perfil.');
    }
}

async function cargarPostsYEventosPerfil(usuarioId) {
    try {
        const response = await fetch(`http://localhost:8001/api/elementos/${usuarioId}`);

        if (!response.ok) {
            console.error('Error al cargar los posts y eventos:', response);
            throw new Error('Error al cargar los posts y eventos del perfil');
        }

        const elementos = await response.json();
        const postsEventosContainer = document.querySelector('.columna-post');
        postsEventosContainer.innerHTML = '';

        elementos.forEach(elemento => {
            const elementoContainer = document.createElement('div');
            elementoContainer.className = elemento.tipo === 'post' ? 'post-container' : 'evento-container';
            elementoContainer.id = `${elemento.tipo}-${elemento.id}`;

            const imgSrcPerfil = elemento.user && elemento.user.foto_perfil
                ? `http://localhost:8000/imagenes/perfiles/${elemento.user.foto_perfil}`
                : 'default-profile.png';
            const userName = elemento.user && elemento.user.name ? elemento.user.name : 'Usuario desconocido';
            const fecha = elemento.created_at;

            // Cabecera de usuario y menú
            elementoContainer.innerHTML = `
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
                </div>
            `;

            // Renderizado específico para posts y eventos
            if (elemento.tipo === 'post') {
                // Comprobar si el título contiene un enlace de YouTube
                let postContent = elemento.titulo;
                const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?/;
                const youtubeMatch = postContent.match(youtubeRegex);

                if (youtubeMatch) {
                    const videoId = youtubeMatch[1];
                    postContent = postContent.replace(youtubeRegex, ''); // Quitar el enlace

                    // Agregar el texto sin el enlace
                    elementoContainer.innerHTML += `<p class="post-text">${postContent.trim()}</p>`;

                    // Agregar el video de YouTube
                    elementoContainer.innerHTML += `
                        <div class="post-media-container">
                            <iframe class="post-media" width="100%" height="400" 
                                src="https://www.youtube-nocookie.com/embed/${videoId}" 
                                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen></iframe>
                        </div>
                    `;
                } else {
                    // Agregar el texto del post si no contiene un enlace de YouTube
                    elementoContainer.innerHTML += `<p class="post-text">${postContent}</p>`;
                }

                // Mostrar imagen o video si el post lo tiene
                if (elemento.contenido) {
                    const extension = elemento.contenido.split('.').pop().toLowerCase();
                    if (['mp4', 'webm', 'ogg'].includes(extension)) {
                        elementoContainer.innerHTML += `
                            <video class="post-media" controls>
                                <source src="http://localhost:8001/imagenes/posts/${elemento.contenido}" type="video/${extension}">
                                Tu navegador no soporta la reproducción de este video.
                            </video>
                        `;
                    } else {
                        elementoContainer.innerHTML += `
                            <div class="post-img-container">
                                <img src="http://localhost:8001/imagenes/posts/${elemento.contenido}" class="post-img" alt="Imagen Post">
                            </div>
                        `;
                    }
                }
            } else if (elemento.tipo === 'evento') {
                // Renderizado específico para eventos
                elementoContainer.innerHTML += `
                    <p class="evento-nombre">${elemento.nombre}</p>
                    <p class="evento-descripcion">${elemento.descripcion || ''}</p>
                    <p class="evento-fechas"><span data-trad="fechaInicio">Inicio</span>: ${elemento.fecha_inicio} - <span class="fechaFin">Fin</span>: ${elemento.fecha_fin}</p>
                `;
                if (elemento.foto) {
                    elementoContainer.innerHTML += `
                        <div class="evento-img-container">
                            <img src="http://localhost:8001/imagenes/eventos/${elemento.foto}" class="evento-img" alt="Imagen Evento">
                        </div>
                        <h2 class="eventoH2" data-trad="eventoH2">Evento</h2>
                    `;
                }
            }

            // Iconos de actividad (like, comment, share)
            if (elemento.tipo === 'post'){
                elementoContainer.innerHTML += `
                    <div class="post-row">
                        <div class="activity-icons">
                            <div>
                                <i id="likeBtn-${elemento.id}" class="fa-regular fa-thumbs-up fa-xl icono" onclick="toggleLike('${elemento.id}')"></i>
                                <span id="likeCount-${elemento.id}">0</span>
                            </div>   
                            <div>
                                <i id="openCommentModal-${elemento.id}" class="fa-solid fa-comment fa-xl icono" onclick="abrirModalComentarios('${elemento.id}')"></i>
                                <span id="comentariosCount_${elemento.id}">0</span>
                            </div>
                        </div>
                    </div>
                `;
            }

            postsEventosContainer.appendChild(elementoContainer);

            obtenerComentariosCount();

            const event = new CustomEvent('postsCargados');
            document.dispatchEvent(event);
        });
    } catch (error) {
        console.error('Error al cargar los elementos:', error);
    }
}

        const dots = document.querySelectorAll('.dots');
        dots.forEach(dot => {
            dot.addEventListener('click', function(event) {
                const dropdown = this.nextElementSibling;
                dropdown.classList.toggle('show');
                event.stopPropagation();
            });
        });

        document.addEventListener('click', function(event) {
            if (!event.target.closest('.menuDots')) {
                document.querySelectorAll('.dropdown-content.show').forEach(dropdown => {
                    dropdown.classList.remove('show');
                });
            }
        });

        const verPerfilBtns = document.querySelectorAll('#verPerfilBtn');
        verPerfilBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = this.getAttribute('data-user-id');
                window.location.href = `perfilUsuario.html?id=${userId}`; 
            });
        });

// Función para obtener la cantidad de comentarios y actualizar el contador en el frontend
async function obtenerComentariosCount() {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await fetch('http://localhost:8001/api/posts/comentarios/count', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener el conteo de comentarios');
        }

        const data = await response.json();

        data.forEach((comentario) => {
            const comentariosCountElement = document.getElementById(`comentariosCount_${comentario.post_id}`);
            if (comentariosCountElement) {
                comentariosCountElement.textContent = comentario.comentarios_count || 0;
            }
        });
    } catch (error) {
        console.error('Error al obtener los comentarios:', error);
    }
}

document.addEventListener('DOMContentLoaded', obtenerPerfilUsuario);