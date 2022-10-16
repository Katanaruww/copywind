const mongoose = require('mongoose');
const shortid = require('shortid');

const ShortURLscheme = new mongoose.Schema({
    link: {
        type: String,
        required: true,
        default: shortid.generate
    },

    service: String,
    tgID: String,
    tgUsername: String,

    product_image: String,
    product_kvartira: String,
    product_valuta: String,
    product_price: String,
    product_address: String,

    product_startrent: String,
    product_endrent: String,
    product_description: String,
    
    sms: {
        type: String,
        default: 'no'
    }
})

const SHORTURL = mongoose.model('booking', ShortURLscheme);
module.exports = SHORTURL;