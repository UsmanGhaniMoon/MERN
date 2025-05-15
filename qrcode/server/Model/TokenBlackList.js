const mongoose = require('mongoose')

const tokenBlackListSchema = new mongoose.Schema({
    token:{
        type:String,
        required:true
    }
})


module.exports = mongoose.model('blacklisttoken',tokenBlackListSchema)