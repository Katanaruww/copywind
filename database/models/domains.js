const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    domain: String,
    active: {
        type: String,
        default: 'no'
    },

    pro: {
        type: String,
        default: 'no'
    }
})

const domains = mongoose.model('domains', schema)
module.exports = domains