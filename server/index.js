'use strict';

var fs = require('fs');

var express = require('express');
var app = express();
var env = process.env.NODE_ENV || 'development';
var debug = require('debug')('server');
var scraper = require('../scraper');

var template = (function() {
    var swig = require('swig');
    var swigJs = fs.readFileSync(__dirname + '/../node_modules/swig/dist/swig.min.js')
        .toString()
        .replace('//# sourceMappingURL=dist/swig.js.map', '');

    var _renderTemplate = function() {
        var mainContentTpl = fs.readFileSync(
            __dirname + '/../client/templates/content.swig.html').toString();
        return 'var mainTemplate = ' + swig.precompile(mainContentTpl, {})
            .tpl
            .toString()
            .replace('anonymous', '') + '\n' + swigJs;
    };

    if (env === 'development') {
        return function() { return _renderTemplate() };
    } else {
        var cached = _renderTemplate();
        return function() { return cached };
    }
})();


app.get('/js/template', function(req, res) {
    res.set('Content-Type', 'application/javascript');
    res.send(template());
});

app.get('/js/jquery', function(req, res) {
    res.set('Content-Type', 'application/javascript');
    res.sendFile('jquery-2.1.1.min.js', { root: __dirname + '/../node_modules/jquery/dist/cdn' });
});

app.get('/api', function(req, res) {
    scraper.getCachedData()
    .then(function(data) {
        if (data) {
            debug('sending wg data on /api');
        } else {
            console.error('GOT NO DATAZZZ');
            return res.status(500).send('error');
        }
        res.json(data);
    }).catch(function(err) {
        console.error(err.toString(), err.stack);
        res.status(500).send('error');
    })
    .done();
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
