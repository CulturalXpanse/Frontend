document.addEventListener("DOMContentLoaded", () => {
    // Variables
    const modalPost = document.getElementById("publish-modal");
    const postButton = document.querySelector(".post-button");
    const closeModalBtn = document.getElementsByClassName("closePosteando")[0];
    const cancelPostBtn = document.querySelector('.cancel-post');
    const submitPostBtn = document.getElementById("submit-post");
        // ------------------------------------------------------ //
    const fileInput = document.getElementById('fileInput');
    const customButton = document.querySelector('.custom-file-upload button');
    const fileNameDisplay = document.getElementById('file-name');
        // ------------------------------------------------------ //
    const postContent = document.getElementById('postContent');
    const postsContainer = document.querySelector('.main-content');

    // Mostrar el modal cuando se hace clic en el botón de post
    postButton.addEventListener('click', () => {
        modalPost.style.display = "block";
    });

    // Cerrar el modal cuando se hace clic en la 'X' o en cancelar
    closeModalBtn.addEventListener('click', closeModal);
    cancelPostBtn.addEventListener('click', closeModal);

    // Cerrar el modal al presionar 'Esc'
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    });

    // Mostrar el nombre del archivo seleccionado
    customButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        fileNameDisplay.textContent = file ? file.name : "Ningún archivo seleccionado";
    });

    // Crear el post cuando se hace clic en 'Publicar'
    submitPostBtn.addEventListener('click', (event) => {
        event.preventDefault();  // Evitar el envío del formulario

        const content = postContent.value;
        const file = fileInput.files[0];

        if (!content.trim()) {
            alert("El contenido no puede estar vacío.");
            return;
        }

        if (!file) {
            alert("Es necesario subir una foto o video.");
            return;
        }

        createPost(content, file);
    });

    // Función para cerrar el modal
    function closeModal() {
        modalPost.style.display = "none";
    }

    // Función para crear un post
    async function createPost(content, file) {
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('content', content);
        formData.append('file', file);  // Añadir archivo al FormData

        try {
            const response = await fetch('http://localhost:8001/api/posts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData  // Enviar como multipart/form-data
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Post creado con éxito', data);
                closeModal();

                // Añadir el post al HTML
                addPostToPage(data);
                alert("Post creado con éxito!");
            } else {
                throw new Error('Error al crear el post');
            }
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error al crear el post.");
        }
    }

    // Función para añadir el post al HTML
    function addPostToPage(postData) {
        // Crear el HTML para el nuevo post
        const postHTML = `
            <div class="post-container">
                <div class="post-row">
                    <div class="user-profile">
                        <img src="../Img/perfilDefault.png" alt="Perfil"> <!-- Puedes cambiar por la foto del usuario -->
                        <div>
                            <p>${postData.user}</p>
                            <span>${postData.created_at}</span>
                        </div>
                    </div>
                    <div class="menuDots">
                    <a class="dots" style="cursor: pointer;"><i class="fa-solid fa-ellipsis"></i></a>
                    <div class="dropdown-contentDots">
                        <a href="../HTML/perfil.html">Ver perfil</a>
                    </div>
                </div>
                </div>
                <p class="post-text">${postData.content}</p>
                ${postData.file_path ? `<img src="${postData.file_path}" class="post-img" alt="Imagen Post">` : ''}
                <div class="post-row">
                    <div class="activity-icons">
                        <div><i class="fa-solid fa-thumbs-up fa-xl"></i>0</div>
                        <div><i class="fa-solid fa-comment fa-xl"></i>0</div>
                        <div><i class="fa-solid fa-share fa-xl"></i></div>
                    </div>
                </div>
            </div>
        `;

        // Añadir el nuevo post al principio del contenedor
        postsContainer.insertAdjacentHTML('afterbegin', postHTML);
    }
});