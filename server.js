// setup
var express = require('express');
var app = express();


// config
app.use(express.static('public'));
app.use(express.static('node_modules'));

// define model


// listen
app.listen(process.env.PORT || 8080);
console.log('App listening on port 8080');


// routes


// export
exports.app = app;
