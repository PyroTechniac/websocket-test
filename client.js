const ws = new WebSocket('ws://example.org')
ws.addEventListener('open', () => {
    ws.send('Hello!')
})