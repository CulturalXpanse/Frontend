let commentModal;
let closeModal;
let submitComment;
let commentInput;

document.addEventListener('DOMContentLoaded', () => {
    commentModal = document.getElementById("commentModal");
    closeModal = document.getElementById("closeModalComentario");
    submitComment = document.getElementById("submitComment");
    commentInput = document.getElementById("commentInput");

    // Cierra el modal al hacer clic en la 'X'
    closeModal.addEventListener('click', () => {
        commentModal.style.display = "none";
    });

    // Cierra el modal al hacer clic fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === commentModal) {
            commentModal.style.display = "none";
        }
    });

    // Cierra el modal al presionar "Escape"
    window.addEventListener('keydown', (event) => {
        if (event.key === "Escape") {
            commentModal.style.display = "none";
        }
    });

    // Envía el comentario
    submitComment.addEventListener('click', () => {
        const commentText = commentInput.value.trim();
        if (commentText) {
            const commentList = document.getElementById("commentList");
            const commentItem = document.createElement("div");
            commentItem.classList.add("comment-item");
            commentItem.textContent = commentText;
            commentList.appendChild(commentItem);
            commentInput.value = "";
            commentModal.style.display = "none";
        }
    });
});

// Función para abrir el modal de comentarios
const openCommentModal = () => {
    commentModal.style.display = "flex";
    commentInput.focus();
};
