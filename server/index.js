'use strict';

var express = require('express');
var app = express();
var scraper = require('../scraper');

var pretty = function(data) {
    return JSON.stringify(data, null, 2);
};

app.get('/api', function(req, res) {
    res.set('Content-Type', 'application/json');
    res.send(pretty(scraper.getCachedData()));
    // res.send(scraper.getCachedData());
});

app.get('/durban', function(req, res) {
    res.sendFile('index.html', {root: __dirname + '/../client/'});
});

app.get('/', function(req, res) {
    res.redirect('/durban');
});

app.use(express.static(__dirname + '/../client/'));

var port = process.env.PORT || 3000;
app.listen(port, function(err) {
    if (err) return console.error(err);
    else console.log('server listening on ', port);
});
