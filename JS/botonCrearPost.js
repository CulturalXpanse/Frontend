document.addEventListener("DOMContentLoaded", () => {

    const modalPost = document.getElementById("publish-modal");
    const postButton = document.querySelector(".post-button");
    const closeModalBtn = document.getElementsByClassName("closePosteando")[0];
    const cancelPostBtn = document.querySelector('.cancel-post');
    const submitPostBtn = document.getElementById("submit-post");
    const fileInput = document.getElementById('fileInput');
    const customButton = document.querySelector('.custom-file-upload button');
    const fileNameDisplay = document.getElementById('file-name');
    const postTitle = document.getElementById('postTitle');

    postButton.addEventListener('click', () => {
        modalPost.style.display = "block";
    });

    closeModalBtn.addEventListener('click', closeModal);
    cancelPostBtn.addEventListener('click', closeModal);

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    });

    customButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        fileNameDisplay.textContent = file ? file.name : "Ningún archivo seleccionado";
    });

    function closeModal() {
        modalPost.style.display = "none";
    }

    submitPostBtn.addEventListener('click', async () => {
        const title = postTitle.value;
        const file = fileInput.files[0];
    
        if (file) {
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/avi', 'video/mpeg'];
            if (!allowedMimeTypes.includes(file.type)) {
                alert("Solo se permiten imágenes o videos en formatos válidos.");
                return;
            }
        }
    
        try {
            const userId = await getUserId();
            if (userId) {
                createPost(title, file, userId);
            } else {
                throw new Error("No se pudo obtener la ID del usuario.");
            }
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error al crear el post.");
        }
    });

    async function getUserId() {
        const token = localStorage.getItem('accessToken');
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

    async function createPost(title, file, userId) {
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('titulo', title);
        formData.append('contenido', file);

        try {
            const response = await fetch('http://localhost:8001/api/posts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                closeModal();
                const alertaExitosoModal = document.getElementById("alertaExitosoModal");
                alertaExitosoModal.style.display = "flex";
            } else {
                throw new Error('Error al crear el post');
            }
        } catch (error) {
            console.error(error);
            const alertaNoExitosoModal = document.getElementById("alertaNoExitosoModal");
            alertaNoExitosoModal.style.display = "flex";
        }
    }

    const closeAlertaExitosoModalBtn = document.getElementById("cerrarModalAlerta");
    closeAlertaExitosoModalBtn.onclick = function() {
        cerrarModal("alertaExitosoModal");
    };

    const closeAlertaNoExitosoModalBtn = document.getElementById("cerrarModalAlertaNo");
    closeAlertaNoExitosoModalBtn.onclick = function() {
        cerrarModal("alertaNoExitosoModal");
    };

    function cerrarModal(modalId) {
        document.getElementById(modalId).style.display = "none";
        window.location.reload();
    }
});