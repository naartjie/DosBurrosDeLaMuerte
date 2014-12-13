'use strict';

var express = require('express');
var app = express();

var swig = require('swig');
var template = require('fs').readFileSync(__dirname + '/../client/templates/content.swig.html');
var tplJsStr = 'var mainTemplate = ' + swig.precompile(template.toString(), { 
    // filename: 'content.swig.html',
    // locals: {},
}).tpl.toString().replace('anonymous', '');

var scraper = require('../scraper');


app.get('/js/template', function(req, res) {
    res.set('Content-Type', 'application/javascript');
    res.send(tplJsStr);
});

app.get('/api', function(req, res) {
    res.json(scraper.getCachedData());
});

app.get('/', function(req, res) {
    res.redirect('/durban');
});

app.get('/durban', function(req, res) {
    res.sendFile('index.html', {root: __dirname + '/../client/'});
});

app.use(express.static(__dirname + '/../client/'));

var port = process.env.PORT || 3000;
app.listen(port, function(err) {
    if (err) return console.error(err);
    else console.log('server listening on ', port);
});
