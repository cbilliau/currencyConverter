const express = require('express');
const http = require('http');
const auth = require('./config/auth.js').auth;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/config.js');
const User = require('./models/users.js');
const Currency = require('./models/currencies.js');
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const app = express();
mongoose.Promise = global.Promise;

// config
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(passport.initialize());

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
            return callback(null, user);
        });
    });
});
passport.use(strategy);

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

app.post('/login',

// passport.authenticate('basic', {session: false}),

function(req, res) {
    console.log('login', req.body);
    var userName = req.params.username;
    User.findOne({
        'username': userName
    }, function(err, user) {
        if (err) {
            return res.status(500).json({success: false});
        }
        res.status(201).json({success: true});
    });
    // var username = req.body.username;
    // var password = req.body.password;
    // var login = username + ':' + password;
    // // console.log(login);
    // auth(login).then(function(response) {
    //     if (response === null) {
    //         res.status(201).json({success: false})
    //     }
    //     res.status(201).json({success: true})
    // });

});

app.get('/login/data', function(req, res) {
    console.log('get user data...');
    auth(req).then(function(response) {
        // console.log(response);
        if (response === null) {
            res.status(201).json({success: false})
        }
        res.status(201).json(response)
    });
});

app.get('/api', function(req, response) {
    // pull three ltr codes from header
    console.log('get currency list...');
    auth(req).then(function(reply) {
        // if reply then call api
        if (reply) {
            http.get('http://api.fixer.io/latest?base=USD', function(res) {
                // console.log(res);
                res.pipe(response);
            });
        } else {
            // if no response then send error
            res.status(500).json({message: 'Internal Server Error'});
        }
    });
});

app.get('/api/:date', function(req, response) {
    console.log('get historical currency...');
    date = req.params.date;
    console.log(req.params);
    auth(req).then(function(reply) {
        if (reply) {
            http.get('http://api.fixer.io/' + date + '?base=USD', function(res) {
                console.log(res.statusMessage);
                res.pipe(response);
            });
        } else {
            res.status(500).json({message: 'Internal Server Error'});
        }
    });
});

app.put('/user/addCurency', function(req, res) {
    console.log('putting currency in user account...');
    var newCurrencyArray = req.body.currencyArray;
    auth(req).then(function(response) {
        if (response === null) {
            res.status(201).json({error: false})
        }
        var key = response._id;
        console.log(key);
        Currency.findByIdAndUpdate(key, {
            userCurrencies: newCurrencyArray
        }, function(err, data) {
            if (err) {
                return res.status(500).json({message: 'Internal Server Error'});
            }
            res.status(201).json({success: true});
        });
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
