const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Array untuk menyimpan pengguna aktif
let users = [];

// Menyediakan file statis dari folder public
app.use(express.static(path.join(__dirname, 'public')));

// Menyediakan file index.html saat root URL diakses
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

wss.on('connection', function connection(ws) {
    // Menambahkan pengguna baru ke daftar users
    let userId = users.length + 1;
    users.push({ id: userId, socket: ws });

    // Mengirim konfirmasi koneksi ke client
    ws.send(JSON.stringify({ type: 'connected', userId }));

    ws.on('message', function incoming(message) {
        // Mengirim pesan ke semua pengguna
        const msg = JSON.parse(message);
        broadcast(JSON.stringify({
            type: 'message',
            userId: msg.userId,
            text: msg.text
        }));
    });

    ws.on('close', function close() {
        // Menghapus pengguna dari daftar saat koneksi ditutup
        users = users.filter(user => user.socket !== ws);
        broadcast(JSON.stringify({ type: 'disconnected', userId }));
    });
});

function broadcast(message) {
    // Mengirim pesan ke semua pengguna terhubung
    users.forEach(user => {
        if (user.socket.readyState === WebSocket.OPEN) {
            user.socket.send(message);
        }
    });
}

server.listen(3000, function listening() {
    console.log('WebSocket server is listening on port 3000');
});
