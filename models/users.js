var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true},
  userCurrencies: { type: Array, required: true}
});

var User = mongoose.model('User', ItemSchema);

module.exports = User;
