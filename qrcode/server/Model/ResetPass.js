const mongoose = require('mongoose');

const resetPassSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reset_token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1h'
    }
})

module.exports = mongoose.model('reset_pass', resetPassSchema);