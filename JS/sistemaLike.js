const likes = {};

const toggleLike = async (postId) => {
    const likeBtn = document.getElementById(`likeBtn-${postId}`);
    const likeCount = document.getElementById(`likeCount_${postId}`);

    if (!likes[postId]) {
        likes[postId] = false;
    }

    if (likes[postId]) {
        // Si el like ya existe, intentamos eliminarlo
        likes[postId] = false;
        likeCount.textContent = parseInt(likeCount.textContent) - 1;
        likeBtn.classList.remove("fa-solid");
        likeBtn.classList.add("fa-regular");

        const success = await eliminarLike(postId);
        if (!success) {
            // Si falla, revertimos los cambios en la interfaz
            likes[postId] = true;
            likeCount.textContent = parseInt(likeCount.textContent) + 1;
            likeBtn.classList.remove("fa-regular");
            likeBtn.classList.add("fa-solid");
        }
    } else {
        // Si el like no existe, intentamos agregarlo
        likes[postId] = true;
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
        likeBtn.classList.remove("fa-regular");
        likeBtn.classList.add("fa-solid");

        const success = await guardarLike(postId);
        if (!success) {
            // Si falla, revertimos los cambios en la interfaz
            likes[postId] = false;
            likeCount.textContent = parseInt(likeCount.textContent) - 1;
            likeBtn.classList.remove("fa-solid");
            likeBtn.classList.add("fa-regular");
        }
    }
};

const guardarLike = async (postId) => {
    const token = localStorage.getItem('accessToken');
    const userId = await getUserId();

    if (!userId) {
        alert("No se pudo obtener el ID del usuario.");
        return false;
    }

    try {
        const response = await fetch('http://localhost:8001/api/likes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                user_id: userId,
                post_id: postId,
            })
        });
        const data = await response.json();

        if (response.ok && data.message === 'Like guardado correctamente') {
            console.log('Like registrado con éxito');
            return true;
        } else {
            alert(data.message);
            return false;
        }
    } catch (error) {
        console.error('Error al guardar el like:', error);
        return false;
    }
};

const eliminarLike = async (postId) => {
    const token = localStorage.getItem('accessToken');
    const userId = await getUserId();

    if (!userId) {
        alert("No se pudo obtener el ID del usuario.");
        return false;
    }

    try {
        const response = await fetch('http://localhost:8001/api/likes/eliminar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                user_id: userId,
                post_id: postId,
            })
        });

        if (response.ok) {
            console.log('Like eliminado con éxito');
            return true;
        } else {
            const data = await response.json();
            alert(data.mensaje);
            return false;
        }
    } catch (error) {
        console.error('Error al eliminar el like:', error);
        return false;
    }
};

const obtenerLikesUsuario = async () => {
    const token = localStorage.getItem('accessToken');
    const userId = await getUserId();

    if (!userId) {
        alert("No se pudo obtener el ID del usuario.");
        return;
    }

    fetch(`http://localhost:8001/api/likes/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.likes) {
            data.likes.forEach(like => {
                likes[like.post_id] = true;
                const likeBtn = document.getElementById(`likeBtn-${like.post_id}`);
                const likeCount = document.getElementById(`likeCount_${like.post_id}`);
                
                if (likeBtn && likeCount) {
                    likeBtn.classList.remove("fa-regular");
                    likeBtn.classList.add("fa-solid");
                }
            });
        }
    })
    .catch(error => console.error('Error al obtener los likes del usuario:', error));
}

document.addEventListener("DOMContentLoaded", obtenerLikesUsuario);

async function obtenerLikesCount() {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await fetch('http://localhost:8001/api/posts/likes/count', {
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
            } else {
            }
        });
    } catch (error) {
        console.error('Error al obtener los likes:', error);
    }
}

document.addEventListener('postsCargados', obtenerLikesCount);

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
