document.addEventListener("DOMContentLoaded", () => {
    const modalGroup = document.getElementById("group-modal");
    const openModalButton = document.getElementById('grupo-icon');
    const closeModalGroupBtn = document.getElementsByClassName("closeGroup")[0];
    const cancelGroupBtn = document.querySelector('.cancel-group');
    const submitGroupBtn = document.getElementById("submit-group");
    const groupPhotoInput = document.getElementById('groupPhotoInput');
    const groupBannerInput = document.getElementById('groupBannerInput');
    const groupFileNameDisplay = document.getElementById('group-file-name');
    const groupBannerNameDisplay = document.getElementById('group-banner-name');
    const customButtonFoto = document.querySelector('.custom-file-upload-group-foto button');
    const customButtonBanner = document.querySelector('.custom-file-upload-group-banner button');

    openModalButton.addEventListener('click', () => {
        modalGroup.style.display = 'block';
    });
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    });

    function closeModal() {
        modalGroup.style.display = "none";
    }

    closeModalGroupBtn.addEventListener('click', closeModal);
    cancelGroupBtn.addEventListener('click', closeModal);

    customButtonFoto.addEventListener('click', () => {
        groupPhotoInput.click();
    });

    customButtonBanner.addEventListener('click', () => {
        groupBannerInput.click();
    });

    groupPhotoInput.addEventListener('change', () => {
        const file = groupPhotoInput.files[0];
        groupFileNameDisplay.textContent = file ? file.name : "Ningún archivo seleccionado";
    });

    groupBannerInput.addEventListener('change', () => {
        const file = groupBannerInput.files[0];
        groupBannerNameDisplay.textContent = file ? file.name : "Ningún archivo seleccionado";
    });

    submitGroupBtn.addEventListener('click', async () => {
        const name = document.getElementById("groupName").value;
        const description = document.getElementById("groupDescription").value;
        const isPublic = document.getElementById("publicGroup").checked;
        const photo = groupPhotoInput.files[0];
        const banner = groupBannerInput.files[0];

        if (photo || banner) {
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
            if (photo && !allowedMimeTypes.includes(photo.type)) {
                alert("Solo se permiten imágenes (jpeg, png, gif, svg) para la foto.");
                return;
            }
            if (banner && !allowedMimeTypes.includes(banner.type)) {
                alert("Solo se permiten imágenes (jpeg, png, gif, svg) para el banner.");
                return;
            }
        }

        try {
            const userId = await getUserId();
            if (userId) {
                await createGroup(name, description, isPublic, photo, banner, userId);
            } else {
                throw new Error("No se pudo obtener la ID del usuario.");
            }
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error al crear el grupo.");
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

    async function createGroup(name, description, isPublic, photo, banner, userId) {
        const token = localStorage.getItem('accessToken');
    
        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('nombre', name);
        formData.append('descripcion', description);
    
        // Convertir isPublic a un valor numérico (1 o 0) si es un valor booleano
        const publicValue = (isPublic === true || isPublic === 'true' || isPublic === 1) ? 1 : 0;
        formData.append('publico', publicValue);
    
        if (photo) formData.append('foto', photo);
        if (banner) formData.append('banner', banner);
    
        try {
            const response = await fetch('http://localhost:8002/api/grupos/crear', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
    
            if (response.ok) {
                closeModal();
                const successModal = document.getElementById("alertaExitosoModalGrupo");
                successModal.style.display = "flex";
            } else {
                throw new Error('Error al crear el grupo');
            }
        } catch (error) {
            console.error(error);
            const errorModal = document.getElementById("alertaNoExitosoModalGrupo");
            errorModal.style.display = "flex";
        }
    }
    

    const closeSuccessModalBtn = document.getElementById("cerrarModalAlertaGrupo");
    closeSuccessModalBtn.onclick = function() {
        cerrarModal("alertaExitosoModalGrupo");
    };

    const closeErrorModalBtn = document.getElementById("cerrarModalAlertaNoGrupo");
    closeErrorModalBtn.onclick = function() {
        cerrarModal("alertaNoExitosoModalGrupo");
    };

    function cerrarModal(modalId) {
        document.getElementById(modalId).style.display = "none";
        window.location.reload();
    }
});