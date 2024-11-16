let usuarios = [];  // Aquí almacenamos todos los usuarios

// Función para obtener los usuarios desde la API
async function obtenerUsuarios() {
    try {
        const response = await fetch('http://localhost:8000/api/usuarios');
        const data = await response.json();
        usuarios = data;
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
    }
}

// Función para buscar y mostrar usuarios
async function buscarUsuarios() {
    const input = document.getElementById('buscarInput');
    const query = input.value.toLowerCase();

    // Si no hay texto en el input, ocultamos los resultados
    if (!query) {
        document.getElementById('usuariosResult').style.display = 'none';
        return;
    }

    // Mostrar el contenedor de resultados mientras buscamos
    document.getElementById('usuariosResult').style.display = 'block';

    // Realiza la búsqueda en la lista de usuarios
    const usuariosFiltrados = usuarios.filter(usuario =>
        usuario.nombre_usuario.toLowerCase().includes(query)
    );

    mostrarUsuarios(usuariosFiltrados);
}

// Función para mostrar la lista de usuarios filtrados
function mostrarUsuarios(usuarios) {
    const contenedor = document.getElementById('usuariosResult');
    contenedor.innerHTML = '';  

    if (usuarios.length === 0) {
        contenedor.innerHTML = '<p>No se encontraron usuarios.</p>';
        return;
    }

    const ul = document.createElement('ul');
    usuarios.forEach(usuario => {
        const li = document.createElement('li');
        li.classList.add('usuario-item');
        li.setAttribute('data-id', usuario.id);

        const imgSrcPerfil = usuario.foto_perfil
            ? `http://localhost:8000/imagenes/perfiles/${usuario.foto_perfil}`
            : '../Img/default-profile.png';

        const userName = usuario.nombre_usuario || 'Usuario desconocido';

        li.innerHTML = `
            <div class="foto-perfil-container">
                <img src="${imgSrcPerfil}" class="foto-perfil" />
            </div>
            <p class="nombre-usuario">${userName}</p>
        `;

        li.addEventListener('click', function() {
            const selectedUserId = li.getAttribute('data-id');
            window.location.href = `perfilUsuario.html?id=${selectedUserId}`;
        });

        ul.appendChild(li);
    });

    contenedor.appendChild(ul);
}



// Función para cargar los usuarios solo cuando se hace clic en el input
document.getElementById('buscarInput').addEventListener('focus', async () => {
    // Verificar si los usuarios ya han sido cargados
    if (usuarios.length === 0) {
        // Si aún no se han cargado, cargarlos ahora
        await obtenerUsuarios();
    }

    // Mostrar la lista de usuarios al hacer clic en el campo de búsqueda
    document.getElementById('usuariosResult').style.display = 'block';

    // Mostrar todos los usuarios (sin filtrar) cuando se hace clic en el campo de búsqueda
    mostrarUsuarios(usuarios);
});

// Evento para ocultar la lista cuando el campo de búsqueda pierde el foco
document.getElementById('buscarInput').addEventListener('blur', () => {
    // Ocultar la lista de usuarios cuando se hace clic fuera del campo de búsqueda
    setTimeout(() => {  // Esperar un poco para ver si se hace clic en un elemento de la lista
        document.getElementById('usuariosResult').style.display = 'none';
    }, 150);
});

// Ejecutar la función obtenerUsuarios cuando se carga la página para asegurarnos de que los usuarios están disponibles
window.onload = obtenerUsuarios;