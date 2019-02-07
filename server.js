const http = require('http')
const { Server } = require('node-static')
const crypto = require('crypto')
const file = new Server('./')
const server = http.createServer((req, res) => {
    req.addListener('end', () => file.serve(req, res)).resume();
});
const port = 3210;
const generateAcceptValue = acceptKey => {
    return crypto
        .createHash('sha1')
        .update(acceptKey + '258EAFA5-E914–47DA-95CA-C5AB0DC85B11', 'binary')
        .digest('base64')
}
server.listen(port, () => {
    console.log(`Server running at https://localhost:${port}`)
})
server.on('upgrade', (req, socket) => {
    if (req.headers['upgrade'] !== 'websocket') {
        socket.end('HTTP/1.1 400 Bad Request')
        return;
    }
})