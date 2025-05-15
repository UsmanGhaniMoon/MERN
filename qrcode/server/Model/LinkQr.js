const mongoose = require('mongoose')

const linkQrSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true, 
    },
    qrlink:{
        type:String,
        required:true,

    },
    qrcolor:{
        type:String,
        required:true,
    },
    qr_status:{
        type:String,
        enum:['Enable', 'Disable'],
        default:'Enable'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
}) 


module.exports = mongoose.model("linkqr", linkQrSchema)