'use strict';

var express = require('express');
var app = express();
var data = require('./lib/data');


var pretty = function(data) {
    return JSON.stringify(data, null, 2);
}

app.get('/api', function(req, res) {
    res.set('Content-Type', 'application/json');
    res.send(pretty(data));
});

var port = process.env.PORT || 3000;
app.listen(port, function(err) {
    if (err) return console.error(err);
    else console.log('server listening on ', port);
});
