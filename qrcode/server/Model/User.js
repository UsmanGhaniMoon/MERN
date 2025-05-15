const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true
    },
    user_email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    user_status: {
        type: String,
        enum: ['Enable', 'Disable'],
        default: 'Enable'
    },
})  


module.exports = mongoose.model('User', userSchema)