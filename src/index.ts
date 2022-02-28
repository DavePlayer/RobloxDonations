import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

const app = express()
app.use(express.json({limit: '10kb'}))
const packetLimit = rateLimit({
    max: 10,// max requests
    windowMs: 60 * 1000, // 1 min
    message: 'Too many requests' // message to send
})
app.use('/announceDonation', packetLimit)
app.use(helmet())

app.get('/', (req: express.Request, res:express.Response) => {
    res.send('sedn dunes')
})

app.post('/announceDonation', (req: express.Request, res:express.Response) => {
    console.log(req.body)
    res.send({xd: 'xd'})
})

app.listen(9000, () => console.log(`listening on port 9000`))

console.log('works again')