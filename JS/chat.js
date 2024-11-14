// Función que maneja la apertura y cierre del chat (para escritorio y móvil)
function toggleChat() {
    const chatContainer = document.getElementById('chat-container');
    
    // Verificamos si es un dispositivo móvil (si el ancho es 768px o menos)
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // En la vista móvil, cambiamos entre el estado minimizado y expandido
        if (chatContainer.classList.contains('minimized')) {
            chatContainer.classList.remove('minimized');
            chatContainer.classList.add('expanded');
        } else {
            chatContainer.classList.remove('expanded');
            chatContainer.classList.add('minimized');
        }
    } else {
        // En vista de escritorio, cambiamos entre el estado minimizado y expandido
        if (chatContainer.classList.contains('minimized')) {
            chatContainer.classList.remove('minimized');
            chatContainer.classList.add('expanded');
        } else {
            chatContainer.classList.remove('expanded');
            chatContainer.classList.add('minimized');
        }
    }
}

// Activamos la apertura del chat al hacer clic en el header del chat
document.getElementById('chat-header').addEventListener('click', toggleChat);

// Lógica para enviar un mensaje
document.getElementById('send-btn').addEventListener('click', function() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();

    if (messageText !== '') {
        addMessage('Usuario', messageText);
        messageInput.value = '';
    }
});

// Función para agregar un mensaje al chat
function addMessage(username, message) {
    const messageContainer = document.getElementById('chat-messages');
    
    // Crear un nuevo mensaje
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'user');
    messageElement.innerHTML = `<strong>${username}:</strong> ${message}`;
    
    // Agregar el mensaje al contenedor
    messageContainer.appendChild(messageElement);

    // Desplazamos la vista al último mensaje
    messageContainer.scrollTop = messageContainer.scrollHeight;
}