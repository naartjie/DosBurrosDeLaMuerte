'use strict';

var express = require('express');
var app = express();
var scraper = require('../scraper');

app.get('/api', function(req, res) {
    res.json(scraper.getCachedData());
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
