'use strict';

var express = require('express');
var app = express();

var fs = require('fs');

var swig = require('swig');
var template = fs.readFileSync(__dirname + '/../client/templates/content.swig.html').toString();
var swigJs = fs.readFileSync(__dirname + '/../node_modules/swig/dist/swig.min.js')
    .toString()
    .replace('//# sourceMappingURL=dist/swig.js.map', '');
var mainTplJs = 'var mainTemplate = ' + swig
    .precompile(template, {})
    .tpl
    .toString()
    .replace('anonymous', '');
var templateJs = swigJs + '\n' + mainTplJs;

var scraper = require('../scraper');

app.get('/js/template', function(req, res) {
    res.set('Content-Type', 'application/javascript');
    res.send(templateJs);
});

app.get('/api', function(req, res) {
    res.json(scraper.getCachedData());
});

app.get('/', function(req, res) {
    res.redirect('/durban');
});

app.get('/durban', function(req, res) {
    res.sendFile('index.html', { root: __dirname + '/../client/' });
});

app.use(express.static(__dirname + '/../client/'));

var port = process.env.PORT || 3000;
app.listen(port, function(err) {
    if (err) return console.error(err);
    else console.log('server listening on ', port);
});
