require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URI)

mongoose.connection.on('connected', ()=>{
    console.log('Connected to MongoDB')
})

mongoose.connection.on('error', (error)=>{
    console.log('Error : ', error)
})


module.exports = mongoose