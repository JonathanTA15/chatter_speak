// server.js

const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Array untuk menyimpan pengguna aktif
let users = [];

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
