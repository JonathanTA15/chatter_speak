// script.js

const ws = new WebSocket('ws://localhost:3000');

ws.onopen = function() {
    console.log('Connected to WebSocket server');
};

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    const messages = document.getElementById('messages');

    switch (data.type) {
        case 'connected':
            // messages.innerHTML += `<div>Terhubung ${data.userId} Pengguna</div>`;
            break;
        case 'disconnected':
            // messages.innerHTML += `<div>User ${data.userId} disconnected</div>`;
            break;
        case 'message':
            messages.innerHTML += `<div>${data.userId}: ${data.text}</div>`;
            break;
        default:
            break;
    }

    messages.scrollTop = messages.scrollHeight;
};

document.getElementById('message-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const user = document.getElementById('user').value;
    const message = document.getElementById('message').value;

    ws.send(JSON.stringify({
        userId: user,
        text: message
    }));

    document.getElementById('message').value = '';
});
