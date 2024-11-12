document.addEventListener("DOMContentLoaded", () => {
    const modalEvent = document.getElementById("event-modal");
    const eventButton = document.querySelector(".event-button");
    const closeModalEventBtn = document.getElementsByClassName("closeEvent")[0];
    const cancelEventBtn = document.querySelector('.cancel-event');
    const submitEventBtn = document.getElementById("submit-event");
    const eventFileInput = document.getElementById('eventFileInput');
    const customButton = document.querySelector('.custom-file-upload-evento button');
    const eventFileNameDisplay = document.getElementById('event-file-name');

    eventButton.addEventListener('click', () => {
        modalEvent.style.display = "block";
    });

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    });

    function closeModal() {
        modalEvent.style.display = "none";
    }

    customButton.addEventListener('click', () => {
        eventFileInput.click();
    });

    closeModalEventBtn.addEventListener('click', closeModalEvent);
    cancelEventBtn.addEventListener('click', closeModalEvent);

    eventFileInput.addEventListener('change', () => {
        const file = eventFileInput.files[0];
        eventFileNameDisplay.textContent = file ? file.name : "Ningún archivo seleccionado";
    });

    submitEventBtn.addEventListener('click', async () => {
        const name = document.getElementById("eventName").value;
        const description = document.getElementById("eventDescription").value;
        const startDate = document.getElementById("eventStartDate").value;
        const endDate = document.getElementById("eventEndDate").value;
        const file = eventFileInput.files[0];

        if (file) {
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedMimeTypes.includes(file.type)) {
                alert("Solo se permiten imágenes o videos en formatos válidos.");
                return;
            }
        }

        try {
            const userId = await getUserId();
            if (userId) {
                await createEvent(name, description, startDate, endDate, file, userId);
            } else {
                throw new Error("No se pudo obtener la ID del usuario.");
            }
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error al crear el evento.");
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

    async function createEvent(name, description, startDate, endDate, file, userId) {
        const token = localStorage.getItem('accessToken');

        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('nombre', name);
        formData.append('descripcion', description);
        formData.append('fecha_inicio', startDate);
        formData.append('fecha_fin', endDate);
        if (file) {
            formData.append('foto', file);
        }
    
        try {
            const response = await fetch('http://localhost:8001/api/eventos', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
    
            if (response.ok) {
                cerrarModal();
                const alertaExitosoModal = document.getElementById("alertaExitosoModal");
                alertaExitosoModal.style.display = "flex";
                clearEventForm();
                window.location.reload();
            } else {
                // Captura el mensaje de error detallado
                const errorData = await response.json();
                console.error("Error al crear el evento:", errorData); 
                alert(`Error al crear el evento: ${errorData.mensaje || 'Error desconocido del servidor'}`);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
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

    function clearEventForm() {
        document.getElementById("eventName").value = "";
        document.getElementById("eventDescription").value = "";
        document.getElementById("eventStartDate").value = "";
        document.getElementById("eventEndDate").value = "";
        eventFileInput.value = null;
        eventFileNameDisplay.textContent = "Ningún archivo seleccionado";
    }
});