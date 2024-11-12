const likes = {};

const toggleLike = (postId) => {
    const likeBtn = document.getElementById(`likeBtn-${postId}`);
    const likeCount = document.getElementById(`likeCount-${postId}`);

    if (!likes[postId]) {
        likes[postId] = false;
    }

    if (likes[postId]) {
        // Si el like ya existe, eliminamos el like
        likes[postId] = false;
        likeCount.textContent = parseInt(likeCount.textContent) - 1;
        likeBtn.classList.remove("fa-solid");
        likeBtn.classList.add("fa-regular");
        eliminarLike(postId);
    } else {
        // Si el like no existe, lo agregamos
        likes[postId] = true;
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
        likeBtn.classList.remove("fa-regular");
        likeBtn.classList.add("fa-solid");
        guardarLike(postId);
    }

}

const guardarLike = async (postId) => {
    const token = localStorage.getItem('accessToken');
    const userId = await getUserId();

    if (!userId) {
        alert("No se pudo obtener el ID del usuario.");
        return;
    }

    fetch('http://localhost:8001/api/likes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            user_id: userId,
            post_id: postId,
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Like guardado correctamente') {
            console.log('Like registrado con éxito');
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error al guardar el like:', error));
};

const eliminarLike = async (postId) => {
    const token = localStorage.getItem('accessToken');
    const userId = await getUserId();

    if (!userId) {
        alert("No se pudo obtener el ID del usuario.");
        return;
    }

    fetch('http://localhost:8001/api/likes', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            user_id: userId,
            post_id: postId,
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Like eliminado correctamente') {
            console.log('Like eliminado con éxito');
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error al eliminar el like:', error));
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
                const likeCount = document.getElementById(`likeCount-${like.post_id}`);
                
                if (likeBtn && likeCount) {
                    likeBtn.classList.remove("fa-regular");
                    likeBtn.classList.add("fa-solid");
                    likeCount.textContent = parseInt(likeCount.textContent) + 1;
                }
            });
        }
    })
    .catch(error => console.error('Error al obtener los likes del usuario:', error));
}

document.addEventListener("DOMContentLoaded", obtenerLikesUsuario);

async function obtenerLikesGlobales() {
    try {
        const response = await fetch('http://localhost:8001/api/likes/global');
        const data = await response.json();

        data.likes.forEach(like => {
            const likeCountElement = document.getElementById(`likeCount-${like.post_id}`);
            if (likeCountElement) {
                likeCountElement.textContent = like.total_likes;
            }
        });
    } catch (error) {
        console.error('Error al obtener los likes globales:', error);
    }
}

document.addEventListener('DOMContentLoaded', obtenerLikesGlobales);

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