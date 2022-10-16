const mongoose = require('mongoose')
const Schema = new mongoose.Schema({
    link: String,
    date: String,

    who_vbiver: String,
    vbiver: String,

    zam: String,
    coder: String,

    sumToTake: Number,
    all: Number,

    kurator: Number,
    kurator_name: {
        type: String,
        default: 'no'
    },

    emailer: Number,
    smser: Number
})

const schema = mongoose.model('cassa', Schema);
module.exports = schema;