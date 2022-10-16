const mongoose = require('mongoose')

const ShortURLscheme = new mongoose.Schema({
    tgID: String,
    tgUsername: String,
    description: String,
    
    profits_count: {
        type: Number,
        default: 0
    },
    
    profits_rub: {
        type: Number,
        default: 0
    },

    count: {
        type: Number,
        default: 0
    }
})

const SHORTURL = mongoose.model('teacher', ShortURLscheme)
module.exports = SHORTURL