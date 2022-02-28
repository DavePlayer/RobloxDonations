import express from 'express'

const app = express()

app.get('/', (req: express.Request, res:express.Response) => {
    res.send('sedn dunes')
})

app.listen(9000, () => console.log(`listening on port 9000`))

console.log('works again')