const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/config.js');
const User = require('./models/users.js');
const Currency = require('./models/currencies.js');
const path = require('path');
const app = express();

// config
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('node_modules'));

// routes
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

app.get('/login/data', function(req, res) {
    // header looks like this: Basic base64encodeddata
    // we split to get the encoded data coming from angular
    var authHeaderB64 = req.headers.authorization.split(' ')[1];
    console.log("Base 64 encoded header: " + authHeaderB64);
    // decode the encoded data
    var buffer = new Buffer(authHeaderB64, 'base64')
    var authHeader = buffer.toString();
    console.log("decoded header with username and password: " + authHeader); //admin:admin
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
            return response.status(500).json({message: 'Internal Server Error'});
        }
        console.log('user = ' + user);
        res.status(200).json(user);
    });
});

app.get('/api/segment', function(){
  // call api method here
});

// call api
var layerApi = function(req, res){
    // api call here
};

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
