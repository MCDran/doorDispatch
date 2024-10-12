    const chatButton = document.getElementById(chatButtonID);
    const chatBox = document.getElementById(chatBoxID);
    const sendButton = document.getElementById(sendButtonID);
    const input = document.getElementById(inputID);
    const chatContainer = document.getElementById(chatContainerID);
    let chatOpen = false;

    // Open chat box on click
    document.getElementById('chatButton').addEventListener('click', function() {
        console.log('Button clicked');
        const chatContainer = document.getElementById('chatContainer');
        const isHidden = chatContainer.style.display === 'none' || chatContainer.style.display === '';
        chatContainer.style.display = isHidden ? 'grid' : 'none';
    });

    // Send message on button click
    sendButton.addEventListener('click', () => {
        const message = input.value;
        if (message.trim()) {
            socket.emit('chat_message', message);  // Emit message to server
            input.value = '';  // Clear input field
        }
    });

    // Display received messages
    function displayMessages(messages) {
        socket.on('receive_message', (msg) => {
            const messagesDiv = document.createElement('div');
            messagesDiv.classList.add('messages');
            messagesDiv.innerText = messages;
            messagesDiv.appendChild(messages);
            messagesDiv.scrollTop = messages.scrollHeight; // Auto-scroll to bottom
        });

        // Vibrate device if supported
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }

        // Flash and shake chat button if chat is not opened
        if (!chatOpen) {
            chatButton.classList.add('flash-shake');
        }
    }
export default class initChat {
}