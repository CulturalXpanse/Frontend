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


async function cargarPosts() {
    try {
        const response = await fetch('http://localhost:8001/api/posts');

        if (!response.ok) {
            console.error('Respuesta de error:', response);
            throw new Error('Error al cargar los posts');
        }

        const posts = await response.json();

        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = '';

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post-container';
            postElement.id = `post-${post.id}`;

            const imgSrcPerfil = post.user && post.user.foto_perfil
                ? `http://localhost:8000/imagenes/perfiles/${post.user.foto_perfil}`
                : 'default-profile.png';
            const userName = post.user && post.user.name ? post.user.name : 'Usuario desconocido';

            const imgSrcPost = post.contenido
                ? `http://localhost:8001/imagenes/posts/${post.contenido}`
                : '';

                const rawFecha = post.created_at;
                let fechaPublicacion;
    
                try {
                    const fechaObj = new Date(rawFecha);
                    if (!isNaN(fechaObj)) {
                        fechaPublicacion = fechaObj.toLocaleString('es-ES', {
                            day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric'
                        });
                    } else {
                        fechaPublicacion = rawFecha || 'Fecha no disponible';
                    }
                } catch (e) {
                    fechaPublicacion = 'Fecha no disponible';
                }

            postElement.innerHTML = `
                <div class="post-row">
                    <div class="user-profile">
                        <div class="profile-pic-container">
                            <img src="${imgSrcPerfil}" class="fotoPerfil" alt="Foto de Perfil"/>
                        </div>
                        <div class="user-info">
                            <p id="nombreUsuario">${userName}</p>
                            <span id="fechaPublicacion">${fechaPublicacion}</span>
                        </div>
                    </div>
                    <div class="menuDots">
                        <a class="dots" style="cursor: pointer;"><i class="fa-solid fa-ellipsis"></i></a>
                        <div class="dropdown-contentDots">
                            <a href="../HTML/perfil.html">Ver perfil</a>
                        </div>
                    </div>
                </div>
                <p class="post-text">${post.titulo}</p>
            `;

            if (post.contenido) {
                postElement.innerHTML += `<img src="${imgSrcPost}" class="post-img" alt="Imagen Post">`;
            }

            postElement.innerHTML += `
                <div class="post-row">
                    <div class="activity-icons">
                        <div>
                            <i id="likeBtn-${post.id}" class="fa-regular fa-thumbs-up fa-xl icono" onclick="toggleLike(${post.id})"></i>
                            <span id="likeCount-${post.id}">0</span>
                        </div>   
                        <div>
                            <i id="openCommentModal" class="fa-solid fa-comment fa-xl icono" onclick="openCommentModal()"></i>
                            <span id="comentarioCount-${post.id}">0</span>
                        </div>
                        <div>
                            <i id="openShareModal" class="fa-solid fa-share fa-xl icono" onclick="openShareModal()"></i>
                        </div>
                    </div>
                </div>
            `;

            mainContent.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error al cargar los posts:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    obtenerPerfilUsuario();
    cargarPosts();
});