'use strict';

var fs = require('fs');
var env = process.env.NODE_ENV || 'development';

module.exports = function(router) {
    router.get('/js/template', function(req, res) {
        res.set('Content-Type', 'application/javascript');
        res.send(templateJs());
    });

    router.get('/js/jquery', function(req, res) {
        res.set('Content-Type', 'application/javascript');
        res.sendFile('jquery-2.1.1.min.js', { 
            root: __dirname + '/../../node_modules/jquery/dist/cdn' 
        });
    });
};

var templateJs = (function() {
    var swig = require('swig');
    var swigJs = fs.readFileSync(__dirname + '/../../node_modules/swig/dist/swig.min.js')
        .toString()
        .replace('//# sourceMappingURL=dist/swig.js.map', '');

    var _renderTemplate = function() {
        var mainContentTpl = fs.readFileSync(
            __dirname + '/../../client/templates/content.swig.html').toString();
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
