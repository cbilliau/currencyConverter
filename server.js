var express = require('express');
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

// routes
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/home.html'));
});

app.get('/users/:username', function(req, res) {
    console.log(req.params);
    // req.params only contains username, not password
    res.sendFile(path.join(__dirname + '/public/main.html'));
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
