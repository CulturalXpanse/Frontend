document.getElementById('chat-header').addEventListener('click', function() {
    const chatContainer = document.getElementById('chat-container');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.querySelector('.chat-input');

    // Alternar entre el estado minimizado y expandido
    if (chatContainer.classList.contains('minimized')) {
        chatContainer.classList.remove('minimized');
        chatMessages.style.display = 'block';
        chatInput.style.display = 'flex';
    } else {
        chatContainer.classList.add('minimized');
        chatMessages.style.display = 'none';
        chatInput.style.display = 'none';
    }
});

document.getElementById('send-btn').addEventListener('click', function() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();

    if (messageText !== '') {
        addMessage('Usuario', messageText);
        messageInput.value = '';
    }
});

function addMessage(username, message) {
    const messageContainer = document.getElementById('chat-messages');
    
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'user');
    messageElement.innerHTML = `<strong>${username}:</strong> ${message}`;

    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}
