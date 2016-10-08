var mongoose = require('mongoose');

var CurrencySchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  userCurrencies: { type: Array, required: true}
});

var Currency = mongoose.model('Currency', CurrencySchema);

module.exports = Currency;