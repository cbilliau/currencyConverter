'use strict';


const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/config.js');
const User = require('./models/users.js');
const Currency = require('./models/currencies.js');
const path = require('path');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const app = express();
mongoose.Promise = global.Promise;

// config
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('node_modules'));

// strategy
var strategy = new BasicStrategy(function(username, password, callback) {
    console.log('BasicStrategy...');

    User.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            callback(err);
            return;
        }

        if (!user) {
            console.log('incorrect username');
            return callback(null, false, {message: 'Incorrect username.'});
        }

        user.validatePassword(password, function(err, isValid) {
            if (err) {
                return callback(err);
            }

            if (!isValid) {
                console.log('incorrect password');
                return callback(null, false, {message: 'Incorrect password.'});
            }
            console.log('user ok');
            return callback(null, user);
        });
    });
});
passport.use(strategy);
app.use(passport.initialize());

// routes
app.post('/signup', function(req, res) {
    console.log('signup');

    if (!req.body) {
        return res.status(400).json({message: "No request body"});
    }

    if (!('username' in req.body)) {
        return res.status(422).json({message: 'Missing field: username'});
    }

    var username = req.body.username;

    if (typeof username !== 'string') {
        return res.status(422).json({message: 'Incorrect field type: username'});
    }

    username = username.trim();

    if (username === '') {
        return res.status(422).json({message: 'Incorrect field length: username'});
    }

    if (!('password' in req.body)) {
        return res.status(422).json({message: 'Missing field: password'});
    }

    var password = req.body.password;

    if (typeof password !== 'string') {
        return res.status(422).json({message: 'Incorrect field type: password'});
    }

    password = password.trim();

    if (password === '') {
        return res.status(422).json({message: 'Incorrect field length: password'});
    }
    // Ecnryption
    // Generate salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return res.status(500).json({message: 'Internal server error'});
        }

        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                return res.status(500).json({message: 'Internal server error'});
            }

            var user = new User({username: username, password: hash});
            var currency = new Currency({username: username, userCurrencies: []});

            user.save().then(function() {
                console.log("successfully saved user!");
                return currency.save();
            }, function(err) {
                console.log("error saving user! " + err.errmsg);
                return res.status(201).json({success: false});
            }).then(function() {
                console.log("successfully saved currency data for user !");
                res.status(201).json({success: true});
            }, function(err) {
                res.status(201).json({success: false});
                console.log("error saving currency for user!");
            });
        });
    });
});

app.post('/login', passport.authenticate('basic', {
    session: false,
    failureRedirect: '/'
}), function(req, res) {
    res.status(201).json({success: true});
});

app.get('/login/data', passport.authenticate('basic', {session: false}), function(req, res) {
    let username = req.user.username;
    Currency.findOne({
        'username': username
    }, function(err, user) {
        if (err) {
            console.log(err);
            return res.status(500).json({success: false});
        }
        res.status(200).json(user);
    });
});

app.get('/api', passport.authenticate('basic', {session: false}), function(req, response) {
    console.log('get currency list...');
    http.get('http://api.fixer.io/latest?base=USD', function(res) {
        res.pipe(response);
    });
});

app.get('/api/:date', passport.authenticate('basic', {session: false}), function(req, response) {
    console.log('get historical currency...', req.params);
    let date = req.params.date;
    http.get('http://api.fixer.io/' + date + '?base=USD', function(res) {
        res.pipe(response);
    });
});

app.put('/user/addCurency', passport.authenticate('basic', {session: false}), function(req, res) {
    console.log('putting currency in user account...');
    let username = req.user.username;
    let newCurrencyArray = req.body.currencyArray;
    Currency.update({
        username: username
    }, {
        userCurrencies: newCurrencyArray
    }, function(err, data) {
        if (err) {
            return res.status(500).json({success: false});
        }
        res.status(201).json({success: true});
    });
});

// server (db / http server)
var runServer = function(callback) {
    mongoose.connect('mongodb://heroku_kx2k6lr0:19tt3ghdp8303hs8s7c38po7al@ds049211.mlab.com:49211/heroku_kx2k6lr0');
    // mongoose.connect(MONGODB_URI || 'mongodb://localhost/current-c',
    // function(err) {
    //     if (err && callback) {
    //         return callback(err);
    //     }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    // });
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
