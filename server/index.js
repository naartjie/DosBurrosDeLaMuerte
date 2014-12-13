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

var port = process.env.PORT || 3000;
app.listen(port, function(err) {
    if (err) return console.error(err);
    else console.log('server listening on ', port);
});
