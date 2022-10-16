const mongoose = require('mongoose');
const shortid = require('shortid');

const ShortURLscheme = new mongoose.Schema({
    link: {
        type: String,
        required: true,
        default: shortid.generate,
        index: true
    },

    service: String,
    tgID: String,
    tgUsername: String,

    product_name: String,
    product_price: String,
    product_image: String,

    product_address: String,
    product_buyer: String,

    sms: {
        type: String,
        default: 'no'
    },

    email: {
        type: String,
        default: 'no'
    }
})

const SHORTURL = mongoose.model('receive', ShortURLscheme);
module.exports = SHORTURL;