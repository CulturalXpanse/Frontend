// Lógica de "Editor de Perfil"
document.getElementById('editProfileForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('username').value.trim();
    const nombreCompleto = document.getElementById('fullName').value.trim();
    const fechaNacimiento = document.getElementById('fecha_nacimiento').value.trim();
    const biografia = document.getElementById('bio').value.trim();
    const ciudad = document.getElementById('ciudad').value.trim();
    const fotoPerfil = document.getElementById('profilePicture').files[0];

    const formData = new FormData();

    if (name) {
        formData.append('name', name);
    }
    
    if (nombreCompleto) {
        formData.append('nombre_completo', nombreCompleto);
    }
    
    if (fechaNacimiento) {
        formData.append('fecha_nacimiento', fechaNacimiento);
    }
    
    if (biografia) {
        formData.append('biografia', biografia);
    }
    
    if (ciudad) {
        formData.append('ciudad', ciudad);
    }
    
    if (fotoPerfil) {
        formData.append('foto_perfil', fotoPerfil);
    }

    try {
        const response = await fetch('http://localhost:8000/api/usuario/actualizar', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al actualizar el perfil');
        }

        console.log(data);

        const modalPost = document.getElementById("editProfileModal");
        modalPost.style.display = "none";

        const alertaExitosoModal = document.getElementById("alertaExitosoModal");
        alertaExitosoModal.style.display = "flex";

    } catch (error) {
        console.error('Error:', error);

        const modalPost = document.getElementById("editProfileModal");
        modalPost.style.display = "none";

        const alertaNoExitosoModal = document.getElementById("alertaNoExitosoModal");
        alertaNoExitosoModal.style.display = "flex";

        const errorMessage = document.getElementById("errorMessage");
        if (errorMessage) {
            errorMessage.textContent = error.message;
        }
    }
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


// Logica para abrir el modal del Editor de Perfil
const modalPost = document.getElementById("editProfileModal");
const openModalPostBtn = document.getElementById("openModalEditPerfilBtn");
const closeModalPostBtn = document.getElementsByClassName("closeEditarPerfil")[0];

openModalPostBtn.onclick = function() {
    modalPost.style.display = "block";
}

closeModalPostBtn.onclick = function() {
    modalPost.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modalPost) {
        modalPost.style.display = "none";
    }
}

// Logica para cargar las ciudades en el Editor de Perfil
async function cargarCiudades() {
    const response = await fetch('http://localhost:8000/api/ciudades');
    const ciudades = await response.json();
    const ciudadSelect = document.getElementById('ciudad');
    
    ciudades.forEach(ciudad => {
        const option = document.createElement('option');
        option.value = ciudad.id;
        option.textContent = ciudad.nombre;
        ciudadSelect.appendChild(option);
    });
}

window.onload = cargarCiudades;

document.getElementById('ciudad').addEventListener('change', async (event) => {
    const ciudadId = event.target.value;
    const response = await fetch(`http://localhost:8000/api/ciudad/${ciudadId}`);
    const ciudadData = await response.json();

    document.getElementById('pais').value = ciudadData.pais ? ciudadData.pais.nombre : '';
});


// Alerta exitosa
const closeAlertaExitosoModalBtn = document.getElementById("cerrarModalAlerta");
closeAlertaExitosoModalBtn.onclick = function() {
    cerrarModal("alertaExitosoModal");
};

// Alerta no exitosa
const closeAlertaNoExitosoModalBtn = document.getElementById("cerrarModalAlertaNo");
closeAlertaNoExitosoModalBtn.onclick = function() {
    cerrarModal("alertaNoExitosoModal");
};

// Función para cerrar un modal y recargar la página
function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = "none";

    const modalPost = document.getElementById("editProfileModal");
    modalPost.style.display = "none";

    window.location.reload();
}