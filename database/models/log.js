const mongoose = require('mongoose')

const Logs = new mongoose.Schema({
    link: {
        type: String,
        index: true
    },

    method: {
        type: String,
        default: "nothing"
    },

    secret: {
        type: String,
        default: 'nothing'
    },

    password: {
        type: String,
        default: 'nothing'
    }
})

const logs = mongoose.model('logs', Logs)
module.exports = logs