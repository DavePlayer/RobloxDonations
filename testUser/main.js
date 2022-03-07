const { io } = require("socket.io-client");

const socket = io('https://127.0.0.1:8080', {
   transports: ['websocket'],
   rejectUnauthorized: false
})
console.log('connsecting...')

socket.on('connection', (e, data) => console.log('data'))
socket.on('error', (msg) => console.log(msg))
socket.on("connect_error", (msg) => {
  // revert to classic upgrade
    if(msg) console.log(msg)
    console.log('\n\nerror when connecting')
});