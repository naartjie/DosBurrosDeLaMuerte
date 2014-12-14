'use strict';

var fs = require('fs');

var express = require('express');
var app = express();
var env = process.env.NODE_ENV || 'development';

var swig = require('swig');
var scraper = require('../scraper');

var template = (function() {
    var swigJs = fs.readFileSync(__dirname + '/../node_modules/swig/dist/swig.min.js')
        .toString()
        .replace('//# sourceMappingURL=dist/swig.js.map', '');

    var _renderTemplate = function() {
        var mainContentTpl = fs.readFileSync(
            __dirname + '/../client/templates/content.swig.html').toString();

        var expandedTpl = fs.readFileSync(
            __dirname + '/../client/templates/expanded.swig.html').toString();

        var collapsedTpl = fs.readFileSync(
            __dirname + '/../client/templates/collapsed.swig.html').toString();

        return 'var expandedTemplate = ' + 
            swig.precompile(expandedTpl, { filename: 'expanded.swig.html' })
            .tpl
            .toString()
            .replace('anonymous', '') + 
            '\n' +
            'var collapsedTemplate = ' + 
            swig.precompile(collapsedTpl, { filename: 'collapsed.swig.html' })
            .tpl
            .toString()
            .replace('anonymous', '') + 
            '\n' +
            'var mainTemplate = ' + 
            swig.precompile(mainContentTpl, {})
            .tpl
            .toString()
            .replace('anonymous', '') + 
            '\n' +
            swigJs;
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
