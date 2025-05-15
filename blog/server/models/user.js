const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user_name:{
        type:String,
        require:true
    },
    user_email:{
        type:String,
        require:true
    },
    user_dob:{
        type:Date,
        require:true
    },
    gender:{
        type:String,
        enum:['male', 'female'],
        default:'male'
    },
    password:{
        type:String,
        require:true
    }
})

module.exports = mongoose.model('mbs_users', userSchema)