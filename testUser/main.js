const { io } = require("socket.io-client");
const fetch = require('node-fetch')

const main = async () => {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
    const json = await fetch('https://127.0.0.1:9000/authenticate', {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({login: '', password: ''})
      })
    const token = await json.json()
    if(token.status && token.status == 'error') return console.log(token);
    console.log(token)
    const socket = await io(`https://127.0.0.1:8080?token=${token.token}`, {
      transports: ['websocket'],
      rejectUnauthorized: false,
    })

    socket.on('connection', (e, data) => console.log('data'))
    socket.on('error', (msg) => console.log(msg))
    socket.on("connect_error", (msg) => {
      // revert to classic upgrade
        if(msg) console.log(msg)
        console.log('\n\nerror when connecting')
    });
    socket.on('donation::donation', (e, data) => console.log(data))
  } catch (error) {
      console.log(error)
  }
}
main()
