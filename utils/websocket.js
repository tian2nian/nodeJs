const WebSocket = require('ws');
const ws = new WebSocket.Server({
    port: 8080,
}, () => {
    console.log('webSocket start');
});
let clients = [];
ws.on('connection', (client) => {
    client.send('主动发送给前端');
    clients.push(client);
    client.on('message', (msg) => {
        if (msg.indexOf('gb') >= 0) {
            sendAll();
        } else {
            client.send('发送给前端');
        }
        console.log(`来自前端的数据：${msg}`);
    });
    client.on('close', (msg) => {
        console.log('前端断开连接了');
    });

});

function sendAll() {
    for (let i = 0; i < clients.length; i++) {
        clients[i].send('广播');
    }
}

module.exports = ws;
