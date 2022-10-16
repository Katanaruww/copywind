const mongoose = require('mongoose')
const shortid = require('shortid')

const Schema = new mongoose.Schema({
    link: {
        type: String,
        required: true,
        default: shortid.generate
    },

    service: String,
    tgID: String,
    tgUsername: String,

    city_from: String,
    place_from: String,
    city_to: String,
    date_from: String,

    price: String,

    sms: {
        type: String,
        default: 'no'
    },

    email: {
        type: String,
        default: 'no'
    }
})

const model = mongoose.model('bbc', Schema)
module.exports = model