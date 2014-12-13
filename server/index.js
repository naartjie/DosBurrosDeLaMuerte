'use strict';

var express = require('express');
var app = express();
var env = process.env.NODE_ENV || 'development';

var fs = require('fs');

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

var scraper = require('../scraper');

app.get('/js/template', function(req, res) {
    res.set('Content-Type', 'application/javascript');
    res.send(template());
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
