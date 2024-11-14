async function abrirModalEventos() {
    try {
        const response = await fetch('http://localhost:8001/api/eventos');
        
        if (!response.ok) {
            throw new Error('Error al obtener los eventos');
        }

        const eventos = await response.json();
        const modal = document.getElementById("modalVerEventos");
        const eventosContainer = document.getElementById("verEventos-container");

        eventosContainer.innerHTML = '';

        eventos.forEach(evento => {
            const imgSrcPerfil = evento.user && evento.user.foto_perfil
                ? `http://localhost:8000/imagenes/perfiles/${evento.user.foto_perfil}`
                : 'default-profile.png';
            const userName = evento.user && evento.user.name ? evento.user.name : 'Usuario desconocido';
            const fecha = evento.created_at;

            const eventoElement = document.createElement('div');
            eventoElement.className = 'verEvento-container';
            eventoElement.innerHTML = `
                <div class="post-rowEvento">
                    <div class="user-profileEvento">
                        <div class="profile-pic-containerEvento">
                            <img src="${imgSrcPerfil}" alt="Foto de Perfil"/>
                        </div>
                        <div class="user-infoEvento">
                            <p id="nombreUsuario">${userName}</p>
                            <span id="fechaPublicacion">${fecha}</span>
                        </div>
                    </div>
                    <div class="menuDots">
                        <a class="dots" href="javascript:void(0);">
                            <i class="fa-solid fa-ellipsis"></i>
                        </a>
                        <div class="dropdown-content">
                            <a id="verPerfilBtn" data-user-id="${evento.user_id}">Ver Perfil</a>
                        </div>
                    </div>
                </div>
                <p class="evento-nombreEvento">${evento.nombre}</p>
                <p class="evento-descripcionEvento">${evento.descripcion || ''}</p>
                <p class="evento-fechasEvento"> ${evento.fecha_inicio} -  ${evento.fecha_fin}</p>
                ${evento.foto ? `
                    <div class="evento-img-containerEvento">
                        <img src="http://localhost:8001/imagenes/eventos/${evento.foto}" class="evento-img" alt="Imagen Evento">
                    </div>` : ''}
            `;

            eventosContainer.appendChild(eventoElement);
        });

        const dots = document.querySelectorAll('.dots');
        dots.forEach(dot => {
            dot.addEventListener('click', function(event) {
                const dropdown = this.nextElementSibling;
                dropdown.classList.toggle('show');
                event.stopPropagation();
            });
        });

        document.addEventListener('click', function(event) {
            if (!event.target.closest('.menuDots')) {
                document.querySelectorAll('.dropdown-content.show').forEach(dropdown => {
                    dropdown.classList.remove('show');
                });
            }
        });

        const verPerfilBtns = document.querySelectorAll('#verPerfilBtn');
        verPerfilBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = this.getAttribute('data-user-id');
                window.location.href = `perfilUsuario.html?id=${userId}`; 
            });
        });

        modal.style.display = "block";

        // Cerrar el modal al hacer clic en la "X"
        document.getElementById("closeModalVerEventos").onclick = function() {
            modal.style.display = "none";
        };

        // Cerrar el modal al hacer clic fuera del contenido
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    } catch (error) {
        console.error('Error al cargar los eventos:', error);
    }
}