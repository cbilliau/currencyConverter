'use strict';

const mongoose = require('mongoose');


const CurrencySchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    userCurrencies: {
        type: Array,
        required: false
    }
});

let Currency = mongoose.model('Currency', CurrencySchema);

module.exports = Currency;
