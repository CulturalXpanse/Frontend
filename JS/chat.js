// Función que maneja la apertura y cierre del chat
function toggleChat() {
    const chatContainer = document.getElementById('chat-container');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.querySelector('.chat-input');

    // Alternar entre el estado minimizado y expandido
    if (chatContainer.classList.contains('minimized')) {
        chatContainer.classList.remove('minimized');
        chatContainer.classList.add('expanded');  // Mostrar el chat con animación
        chatMessages.style.display = 'block';
        chatInput.style.display = 'flex';
    } else if (chatContainer.classList.contains('expanded')) {
        chatContainer.classList.add('minimized');
        chatContainer.classList.remove('expanded');  // Ocultar el chat con animación
        chatMessages.style.display = 'none';
        chatInput.style.display = 'none';
    } else {
        // Si el chat está oculto, mostramos el chat con animación
        chatContainer.classList.add('expanded');
        chatMessages.style.display = 'block';
        chatInput.style.display = 'flex';
    }
}

// Abrir o cerrar el chat al hacer clic en el botón de chat (para la vista responsive)
document.getElementById('chat-toggle-btn').addEventListener('click', toggleChat);

// Funcionalidad para enviar el mensaje
document.getElementById('send-btn').addEventListener('click', function() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();

    // Solo agregar el mensaje si no está vacío
    if (messageText !== '') {
        addMessage('Usuario', messageText);
        messageInput.value = ''; // Limpiar el input
    }
});

// Función para agregar un mensaje al chat
function addMessage(username, message) {
    const messageContainer = document.getElementById('chat-messages');
    
    // Crear un nuevo elemento para el mensaje
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'user');
    messageElement.innerHTML = `<strong>${username}:</strong> ${message}`;

    // Añadir el mensaje al contenedor
    messageContainer.appendChild(messageElement);

    // Desplazar el contenedor hacia abajo para mostrar el último mensaje
    messageContainer.scrollTop = messageContainer.scrollHeight;
}