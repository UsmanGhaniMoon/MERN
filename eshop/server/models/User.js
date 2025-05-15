const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    uemail:{
        type:String,
        required:true
    },
    upass:{
        type:String,
        required:true
    },
    ustatus:{
        type:String,
        enum:["Enable","Disable"],
        default:"Enable",
    }
})

module.exports = mongoose.model('eshop_user',userSchema)