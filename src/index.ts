import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import SocketIO from 'socket.io'
import dotenv from 'dotenv'
import { google } from 'googleapis'
import socket from 'socket.io'
import moment from 'moment'


// .env
dotenv.config()

// server www
const app = express()
app.use(express.json({ limit: '10kb' }))
const packetLimit = rateLimit({
    max: 10,// max requests
    windowMs: 60 * 1000, // 1 min
    message: { status: 'error', details: 'too many request' } // message to send
})
app.use('/announceDonation', packetLimit)
app.use(helmet())

// websockets
const http = require('http').createServer(app);
const wws = new socket.Server(http);

wws.on("connection", (socket: SocketIO.Socket) => {
    console.log("new client connected");
    socket.send("connection confirmed");

    socket.on("donate::donate", (e, data) => {
        console.log('emited donate: ', data)
    });
});


app.get('/', (req: express.Request, res: express.Response) => {
    res.send('sedn dunes')
})



interface request {
    donateImageUrl: string;
    userName: string;
    robuxAmmount: number;
    message: string;
}

app.post('/announceDonation', async (req: express.Request, res: express.Response) => {
    if (!req.body) return res.status(406).json({ status: 'error', details: 'no body inside http request' })
    if (req.body.login != process.env.GAME_LOGIN || req.body.password != process.env.GAME_PASSWORD) return res.status(403).json({ status: 'error', details: 'invalid login data' })
    const data: request = {
        donateImageUrl: req.body.donateImageUrl,
        userName: req.body.userName,
        robuxAmmount: req.body.robuxAmmount,
        message: req.body.message,
    }
    if (data.donateImageUrl == undefined || data.message == undefined || data.robuxAmmount == undefined || data.userName == undefined) return res.status(406).json({ status: 'error', details: 'invalid http body structure' })
    const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    const time = moment().local().unix() + (3600) // 3600 because of winter time :|
    // hate working with time
    // doctor strange is going to kill me
    console.log('time: ', time)
    try {
        const client = await auth.getClient();
        const sheets = await google.sheets({ version: 'v4', auth })
        // const response = await sheets.spreadsheets.values.get({ range: `Donations!A2:C2`, spreadsheetId: process.env.SHEET_ID })

        // const [title, data]: any = response.data.values

        // console.log('title: ', title, '\n\ndata: ', data)
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SHEET_ID,
            auth,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            range: `Donations!A:E`,
            // resource: { values: ['ktoś', 'mihalx', '120', '1970', 'image url', "message"] }
            requestBody: { values: [[data.userName, 'mihalx', data.robuxAmmount, time, data.donateImageUrl, data.message]] }
        })
    } catch (error) {
        console.log(error)
    }

    wws.emit('donate::donate', data)

    res.send({ xd: 'xd' })
})

app.listen(9000, () => console.log(`www on port 9000`))
http.listen(8080, () => console.log("http working on 8080"));

console.log('works again')