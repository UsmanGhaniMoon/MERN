require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const serverless = require('serverless-http')
const db = require('../db')

//const userModle = require('./Model/User')

//All router will be here
const userRouter = require('../Route/UserRoute')

const app = express()

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    //credentials: true 
}))

//All route initiate here
app.use('/api/user', userRouter)

module.exports = app
module.exports.handler = serverless(app)

// const port = process.env.PORT || 5000

// app.listen(port, (req,res)=>{
//     console.log(`Server is running on port : http://127.0.0.1:${port}`)
// })


