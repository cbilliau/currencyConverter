const Currency = require('../models/currencies.js');

exports.auth = function(req) {
    // header looks like this: Basic base64encodeddata
    // we split to get the encoded data coming from angular
    var authHeaderB64 = req.headers.authorization.split(' ')[1];
    // console.log("Base 64 encoded header: " + authHeaderB64);
    // decode the encoded data
    var buffer = new Buffer(authHeaderB64, 'base64')
    var authHeader = buffer.toString();
    // console.log("decoded header with username and password: " + authHeader); //admin:admin
    // you now have the username and password and can query the currency model with the username
    var splitHeader = function(data) {
        var arr = data.split(':');
        return arr[0];
    };
    var username = splitHeader(authHeader);
    var key = Currency.findOne({
        'username': username
    }, function(err, user) {
        if (err) {
            return err;
        }
        return user;
    });
    return key;
};
