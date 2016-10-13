const express = require('express');
const http = require('http');
const auth = require('./config/auth.js').auth;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
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
app.post('/signup', function(req, res) {
    console.log('signup');
    var username = req.body.username;
    var password = req.body.password;
    var user = new User({username: username, password: password});
    var currency = new Currency({username: username, userCurrencies: []});
    user.save().then(function() {
        console.log("successfully saved user!");
        return currency.save();
    }, function(err) {
        console.log("error saving user! " + err);
        return res.status(201).json({success: false});
    }).then(function() {
        console.log("successfully saved currency data for user !");
        res.status(201).json({success: true});
    }, function(err) {
        res.status(201).json({success: false});
        console.log("error saving currency for user!");
    });
});

app.post('/login', function(req, res) {
  console.log('login');
  var username = req.body.username;
  var password = req.body.password;
  var login = username + ':' + password;
  console.log(login);
    auth(login).then(function(response) {
      if (response === null) {
        res.status(201).json({success:false})
      }
      res.status(201).json({success:true})
    });
});

app.get('/login/data', function(req, res) {
    console.log('get user data');
    auth(req).then(function(response) {
        console.log(response);
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
