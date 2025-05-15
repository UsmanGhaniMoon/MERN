require('dotenv').config()
const mongoose = require("mongoose")

const dburi = process.env.DB_URI
mongoose.connect(dburi) 

mongoose.connection.on('connected', ()=>{
    console.log('Connected to mongodb')
})


mongoose.connection.on('error', (err)=>{
    console.error('Connection Error: ', err)
})

module.exports = mongoose