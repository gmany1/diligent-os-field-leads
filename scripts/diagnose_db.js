const net = require('net');

const port = 5432;
const host = 'localhost';

console.log(`Checking connection to ${host}:${port}...`);

const socket = new net.Socket();

socket.setTimeout(2000);

socket.on('connect', () => {
    console.log('Successfully connected to port 5432');
    socket.destroy();
});

socket.on('timeout', () => {
    console.log('Connection timed out');
    socket.destroy();
});

socket.on('error', (err) => {
    console.log('Connection error:', err.message);
});

socket.connect(port, host);
