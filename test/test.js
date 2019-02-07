#!/usr/bin/env node
const ws = require('websocket').server
const http = require('http')
const server = http.createServer((req, res) => {
    console.log(`${new Date()} Received request for ${req.url}`)
    res.writeHead(404)
    res.end();
})
server.listen(8080, () => {
    console.log(`${new Date()} Server is listening on port 8080`)
})
wsServer = new ws({
    httpServer: server,
    autoAcceptConnections: false
})
const originIsAllowed = origin => {
    return true;
}
wsServer.on('request', request => {
    if (!originIsAllowed(request.origin)) {
        request.reject()
        console.log(`${new Date()} Connection from origin ${request.origin} rejected`)
        return;
    }
    const connection = request.accept('echo-protocol', request.origin)
    console.log(`${new Date()} Connection accepted`)
    connection.on('message', message => {
        if (message.type === 'utf8') {
            console.log(`Received Message: ${message.utf8Data}`)
            connection.sendUTF(message.utf8Data)
        }
        else if (message.type === 'binary') {
            console.log(`Received Binary Message of ${message.binaryData.length} bytes`)
            connection.sendBytes(message.binaryData)
        }
    })
    connection.on('close', (reasonCode, description) => {
        console.log(`${new Date()} Perr ${connection.remoteAddress} disconnected`)
    })
})