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

        const editProfileModal = document.getElementById("editProfileModal");
        editProfileModal.style.display = "none";

        const alertaExitosoModal = document.getElementById("alertaExitosoModalPerfil");
        alertaExitosoModal.style.display = "flex";

    } catch (error) {
        console.error('Error:', error);

        const editProfileModal = document.getElementById("editProfileModal");
        editProfileModal.style.display = "none";

        const alertaNoExitosoModal = document.getElementById("alertaNoExitosoModalPerfil");
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
const editProfileModal = document.getElementById("editProfileModal");
const openModalEditPerfilBtn = document.getElementById("openModalEditPerfilBtn");
const closeEditarPerfil = document.getElementsByClassName("closeEditarPerfil")[0];

openModalEditPerfilBtn.onclick = async function() {
    editProfileModal.style.display = "block";

    try {
        const response = await fetch('http://localhost:8000/api/usuario/actual', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        const userData = await response.json();

        if (response.ok) {
            document.getElementById('username').value = userData.name || '';
            document.getElementById('fullName').value = userData.nombre_completo || '';
            document.getElementById('bio').value = userData.biografia || '';
        } else {
            throw new Error('No se pudo cargar el perfil');
        }
    } catch (error) {
        console.error('Error al cargar los datos del perfil:', error);
    }
};

closeEditarPerfil.onclick = function() {
    editProfileModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == editProfileModal) {
        editProfileModal.style.display = "none";
    }
}

// Logica para cargar las ciudades en el Editor de Perfil
async function cargarCiudades() {
    try {
        const response = await fetch('http://localhost:8000/api/ciudades');
        
        if (!response.ok) {
            throw new Error('Error al obtener las ciudades');
        }
        
        const ciudades = await response.json();
        const ciudadSelect = document.getElementById('ciudad');
        
        ciudadSelect.innerHTML = '';

        ciudades.forEach(ciudad => {
            const option = document.createElement('option');
            option.value = ciudad.id;
            option.textContent = ciudad.nombre;
            ciudadSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar las ciudades:', error);
    }
}

window.addEventListener('load', cargarCiudades);

document.getElementById('ciudad').addEventListener('change', async (event) => {
    const ciudadId = event.target.value;
    const response = await fetch(`http://localhost:8000/api/ciudad/${ciudadId}`);
    const ciudadData = await response.json();

    document.getElementById('pais').value = ciudadData.pais ? ciudadData.pais.nombre : '';
});

// Alerta Perfil exitosa
const closeAlertaExitosoModalPerfilBtn = document.getElementById("cerrarModalAlertaPerfil");
closeAlertaExitosoModalPerfilBtn.onclick = function() {
    cerrarModal("alertaExitosoModalPerfil");
};

// Alerta Perfil no exitosa
const closeAlertaNoExitosoModalPerfilBtn = document.getElementById("cerrarModalAlertaNoPerfil");
closeAlertaNoExitosoModalPerfilBtn.onclick = function() {
    cerrarModal("alertaNoExitosoModalPerfil");
};


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