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
            obtenerLikesCount(userId);
            obtenerComentariosCount(userId);

        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un problema al cargar el perfil.');
        }
    }

    async function cargarPostsPerfilOtro(usuarioId) {
        try {
            const response = await fetch(`http://localhost:8001/api/elementos/${usuarioId}`);
            if (!response.ok) throw new Error('Error al cargar los elementos');

            const elementos = await response.json();
            const mainContent = document.querySelector('.columna-postOtroPerfil');
            mainContent.innerHTML = '';

            elementos.forEach(elemento => {
                const elementoContainer = document.createElement('div');
                elementoContainer.className = elemento.tipo === 'post' ? 'post-container' : 'evento-container';
                elementoContainer.id = `${elemento.tipo}-${elemento.id}`;

                const imgSrcPerfil = elemento.user && elemento.user.foto_perfil
                    ? `http://localhost:8000/imagenes/perfiles/${elemento.user.foto_perfil}`
                    : 'default-profile.png';
                const userName = elemento.user && elemento.user.name ? elemento.user.name : 'Usuario desconocido';
                const fecha = elemento.created_at;

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

                if (elemento.tipo === 'post') {
                    let postContent = elemento.titulo;
                    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?/;
                    const youtubeMatch = postContent.match(youtubeRegex);

                    if (youtubeMatch) {
                        const videoId = youtubeMatch[1];
                        postContent = postContent.replace(youtubeRegex, '');

                        elementoContainer.innerHTML += `<p class="post-text">${postContent.trim()}</p>`;

                        elementoContainer.innerHTML += `
                            <div class="post-media-container">
                                <iframe class="post-media" width="100%" height="400" 
                                    src="https://www.youtube-nocookie.com/embed/${videoId}" 
                                    frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen></iframe>
                            </div>
                        `;
                    } else {
                        elementoContainer.innerHTML += `<p class="post-text">${postContent}</p>`;
                    }

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

                if (elemento.tipo === 'post') {
                    elementoContainer.innerHTML += `
                        <div class="post-row">
                            <div class="activity-icons">
                                <div>
                                    <i id="likeBtn-${elemento.id}" class="fa-regular fa-thumbs-up fa-xl icono" onclick="toggleLike(${elemento.id})"></i>
                                    <span id="likeCount_${elemento.id}">0</span>
                                </div>   
                                <div>
                                    <i id="openCommentModal-${elemento.id}" class="fa-solid fa-comment fa-xl icono" onclick="abrirModalComentarios('${elemento.id}')"></i>
                                    <span id="comentariosCount_${elemento.id}">0</span>
                                </div>
                                <div>
                                    <i id="openShareModal" class="fa-solid fa-share fa-xl icono" onclick="openShareModal()"></i>
                                </div>
                            </div>
                        </div>
                    `;
                }

                mainContent.appendChild(elementoContainer);
            });

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

        } catch (error) {
            console.error('Error al cargar los elementos:', error);
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

            const amistadContainer = document.querySelector('.amistad-container');
            amistadContainer.innerHTML = '';

            let botonAmistad;
            if (esAmigo) {
                botonAmistad = document.createElement('button');
                botonAmistad.id = 'deleteFriendBtn';
                botonAmistad.className = 'opciones_O_anadir';
                botonAmistad.innerHTML = 'Eliminar amigo/a';
                botonAmistad.addEventListener('click', () => eliminarAmigo(userId, profileId));
            } else {
                botonAmistad = document.createElement('button');
                botonAmistad.id = 'addFriendBtn';
                botonAmistad.className = 'opciones_O_anadir';
                botonAmistad.textContent = 'Añadir amigo/a'; 
                botonAmistad.addEventListener('click', () => agregarAmigo(userId, profileId));
            }

            amistadContainer.appendChild(botonAmistad);
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un problema al verificar la amistad.');
        }
    }

    async function agregarAmigo(userId, profileId) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/seguir/${userId}/${profileId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (response.status === 201) {
                const alertaExitosoModal = document.getElementById("alertaExitosoModalAmigo");
                alertaExitosoModal.style.display = "flex";
                verificarAmistad(userId, profileId);
            } else {
                const alertaNoExitosoModal = document.getElementById("alertaNoExitosoModalAmigo");
                alertaNoExitosoModal.style.display = "flex";
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }


    const closeAlertaExitosoModalBtn = document.getElementById("cerrarModalAlertaAmigo");
    closeAlertaExitosoModalBtn.onclick = function() {
        cerrarModal("alertaExitosoModal");
    };

    const closeAlertaNoExitosoModalBtn = document.getElementById("cerrarModalAlertaNoAmigo");
    closeAlertaNoExitosoModalBtn.onclick = function() {
        cerrarModal("alertaNoExitosoModal");
    };

    async function eliminarAmigo(userId, profileId) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/dejar-de-seguir/${userId}/${profileId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
    
            if (response.status === 200) {
                const alertaExitosoModal = document.getElementById("alertaExitosoModalEliminarAmigo");
                alertaExitosoModal.style.display = "flex";
                verificarAmistad(userId, profileId); 
            } else {
                const alertaNoExitosoModal = document.getElementById("alertaNoExitosoModalEliminarAmigo");
                alertaNoExitosoModal.style.display = "flex";
            }
        } catch (error) {
            console.error('Error:', error);
            const alertaNoExitosoModal = document.getElementById("alertaNoExitosoModalEliminarAmigo");
            alertaNoExitosoModal.style.display = "flex";
        }
    }

    const closeAlertaExitosoEliminarAmigoModalBtn = document.getElementById("cerrarModalAlertaEliminarAmigo");
    closeAlertaExitosoEliminarAmigoModalBtn.onclick = function() {
        cerrarModal("alertaExitosoModal");
    };

    const closeAlertaNoExitosoEliminarAmigoModalBtn = document.getElementById("cerrarModalAlertaNoEliminarAmigo");
    closeAlertaNoExitosoEliminarAmigoModalBtn.onclick = function() {
        cerrarModal("alertaNoExitosoModal");
    };

    function cerrarModal(modalId) {
        document.getElementById(modalId).style.display = "none";
        window.location.reload();
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

            const imgSrcPerfil = amigo.foto_perfil
                ? `http://localhost:8000/imagenes/perfiles/${amigo.foto_perfil}`
                : '../Img/default-profile.png';

            const userName = amigo.name ? amigo.name : 'Usuario desconocido';

            amigoElement.innerHTML = `
                <div class="foto-perfil-container">
                    <img src="${imgSrcPerfil}" class="foto-perfil" alt="Foto de perfil de ${userName}"/>
                </div>
                <a><p>${userName}</p><i class="fa-solid fa-message"></i></a>
            `;

            listaAmigos.appendChild(amigoElement);
        });
    }

    const friendList = document.querySelector('.amigos-listOtro');
    const contextMenu = document.getElementById('context-menu');
    let selectedUserId = null;

    friendList.addEventListener('contextmenu', function(e) {
        e.preventDefault();

        if (e.target.closest('.amigos')) {
            const amigo = e.target.closest('.amigos');
            selectedUserId = amigo.getAttribute('id');
            contextMenu.style.display = 'block';
            contextMenu.style.top = `${e.pageY}px`;
            contextMenu.style.left = `${e.pageX}px`;
        }
    });

    document.addEventListener('click', () => {
        contextMenu.style.display = 'none';
    });

    document.getElementById('view-profile').addEventListener('click', () => {
        if (selectedUserId) {
            window.location.href = `perfilUsuario.html?id=${selectedUserId}`;
        }
    });

    async function obtenerLikesCount(userId) {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch(`http://localhost:8001/api/likes/usuario/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener el conteo de likes');
            }

            const data = await response.json();

            data.forEach((likes) => {
                const likeCountElement = document.getElementById(`likeCount_${likes.post_id}`);
                if (likeCountElement) {
                    likeCountElement.textContent = likes.total_likes || 0;
                }
            });
        } catch (error) {
            console.error('Error al obtener los likes:', error);
        }
    }

    async function obtenerComentariosCount(userId) {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch(`http://localhost:8001/api/posts/comentarios/count/usuario/${userId}`, {
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

    document.addEventListener('DOMContentLoaded', () => {
        obtenerPerfilUsuario();
        obtenerPerfilPorId();
        obtenerAmigos();
    });