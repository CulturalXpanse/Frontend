async function obtenerGrupos() {
    try {
        const token = localStorage.getItem('accessToken'); // Obtener el token de localStorage
        const response = await fetch('http://localhost:8002/api/grupos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('No se pudieron obtener los grupos');
        }

        const data = await response.json();
        const grupos = data.grupos || [];

        if (Array.isArray(grupos)) {
            mostrarGrupos(grupos);
        } else {
            console.error('La respuesta no contiene un array de grupos');
        }
    } catch (error) {
        console.error('Error al obtener los grupos:', error);
    }
}

function mostrarGrupos(grupos) {
    const listaGrupos = document.querySelector('.group-list');

    grupos.forEach(grupo => {
        const groupElement = document.createElement('div');
        groupElement.classList.add('group');

        const imgSrcGrupo = grupo.foto
            ? `http://localhost:8002/fotos/grupos/${grupo.foto}`
            : '../Img/default-group.png';

        const grupoName = grupo.nombre || 'Grupo desconocido';

        groupElement.innerHTML = `
            <div class="foto-grupo-container">
                <img src="${imgSrcGrupo}" class="foto-grupo"/>
            </div>
            <a><p>Grupo ${grupoName}</p></a>
        `;

        listaGrupos.appendChild(groupElement);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    obtenerGrupos();
});
