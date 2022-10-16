const mongoose = require('mongoose');

const ShortURLscheme = new mongoose.Schema({
    id: String,
    who: String,
    text: String,
    time: String
})

const SHORTURL = mongoose.model('support', ShortURLscheme);
module.exports = SHORTURL;