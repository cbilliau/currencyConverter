const express = require('express');
const http = require('http');
const auth = require('./config/auth.js').auth;
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
    auth(req).then(function(response) {
        console.log(response);
        res.status(200).json(response)
    });
});

app.get('/api/:data', function(req, res) {
    // pull three ltr codes from header
    var codes = req.params.data;
    var returnedRates;
    // call authorization routine
    auth(req).then(function(response) {

        // if response then call api
        if (response) {
            var options = {
                host: 'www.apilayer.net',
                path: '/api/live?access_key=6bd7e9293254526403d839455fcb946c&currencies=' + codes + '&format=1'
            };
            http.get(options, function(res) {
                console.log("Got response: " + res.statusCode);
                res.on("data", function(chunk) {
                    console.log("BODY: " + chunk);

                });
            }).on('error', function(e) {
                console.log("Got error: " + e.message);
                return e.message;
            });
        } else {
            // if no response then send error
            res.status(500).json({message: 'Internal Server Error BLAH'});
        }
    });
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
