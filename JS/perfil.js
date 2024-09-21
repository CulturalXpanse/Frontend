document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
    });
});

const modal = document.getElementById("editProfileModal");
const openModalBtn = document.getElementById("openModalEditPerfilBtn");
const closeModalBtn = document.getElementsByClassName("closeEditarPerfil")[0];

openModalBtn.onclick = function() {
    modal.style.display = "block";
}
// Cerrar el modal al hacer clic en la 'X'
closeModalBtn.onclick = function() {
    modal.style.display = "none";
}
// Cerrar el modal al hacer clic fuera del contenido
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Simulación del submit (puedes reemplazarlo con una lógica real para guardar los datos)
document.getElementById("editProfileForm").onsubmit = function(event) {
    event.preventDefault();
    alert("Perfil actualizado con éxito");
    modal.style.display = "none";
};
