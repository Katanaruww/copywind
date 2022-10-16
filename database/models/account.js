const mongoose = require('mongoose')

const ShortURLscheme = new mongoose.Schema({
    tgID: String,
    tgUsername: String,

    tag: String,
    btc: String,

    status: {
        type: String,
        default: 'Воркер'
    },

    domainSelect: {
        type: String,
        default: 'public'
    },

    domain: {
        type: String,
        default: 'none'
    },

    teacher: {
        type: String,
        default: 'Отсутствует'
    },

    profits_with_teacher: {
        type: Number,
        default: 0
    },

    total_profits: {
        type: Number,
        default: 0
    },

    profit_sum_rub: {
        type: Number,
        default: 0
    },

    profit_sum_eur: {
        type: Number,
        default: 0
    },

    address: {
        type: String,
        default: ''
    },

    name: {
        type: String,
        default: ''
    },

    percent: {
        type: Number,
        default: 60
    },

    hide_service: {
        type: String,
        default: 'no'
    }
})

const SHORTURL = mongoose.model('account', ShortURLscheme)
module.exports = SHORTURL