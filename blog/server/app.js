require('dotenv').config()
const express = require('express')
const cors = require('cors')
const db = require('./db')
const app = express()

const userRoute = require('./routes/userapi')

app.use(express.json())
app.use(cors())

app.use('/api/user', userRoute)

const port = process.env.PORT || 5000

app.get('/', (req, res)=>{
    res.send("Hello World from Server")
})

app.listen(port, ()=>{
    console.log(`Server is Running on : http://localhost:${port}`)
})

