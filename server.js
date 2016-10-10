var express = require('express');
var basicAuth = require('basic-auth');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/config.js');
var User = require('./models/users.js');
var Currency = require('./models/currencies.js');
var path = require('path');
var app = express();

// config
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('node_modules'));

// auth
var auth = function(req, res, next) {
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
    };
    var user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    };
    if (user.name === 'admin' && user.pass === 'admin') {
        return next();
    } else {
        return unauthorized(res);
    };
};

app.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var user = new User({username: username, password: password});
    var currency = new Currency({username: username, userCurrencies: []});
    currency.save(function(err) {
        if (err) {
            // return res.status(500).json({message: 'Internal server error - currency'});
        }
        // return res.status(201).json({success: true});
    });
    user.save(function(err) {
        if (err) {
            // return res.status(500).json({message: 'Internal server error - user'});
        }
        // return res.status(201).json({success: true});
    });

    res.status(201).json({success: true});
});

app.get('/login/data', auth, function(req, res) {
    // header looks like this: Basic base64encodeddata
    // we split to get the encoded data coming from angular
    var authHeaderB64 = req.headers.authorization.split(' ')[1];
    console.log("Base 64 encoded header: " + authHeaderB64);
    // decode the encoded data
    var buffer = new Buffer(authHeaderB64, 'base64')
    var authHeader = buffer.toString();
    console.log("decoded header with username and password: " + authHeader); //admin:admin
    // you now have the username and password and can query the currency model with the username
    
    // !!!!!!!! Need to get 'key' and then send into Curreny schema to get data HOW??
    var key =
    Currency.findOne({
        'username': userName
    }, function(err, user) {
        if (err) {
            return response.status(500).json({
                message: 'Internal Server Error'
            });
        }
        response.status(200).json(user);
    });
    res.status(201).json({success: true});
});

// server (db / http server)
var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};

if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
};

// export
exports.app = app;
exports.runServer = runServer;
