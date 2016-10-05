// setup
var express = require('express');
var app = express();


// config
app.use(express.static('public'));
app.use(express.static('node_modules'));

// define model


// routes

// application
app.get('*', function(req, res) {
        res.sendfile('./public/login.html'); 
    });

// listen
app.listen(process.env.PORT || 8080);
console.log('App listening on port 8080');


// export
exports.app = app;
