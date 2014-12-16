'use strict';

var express = require('express');
var app = express();
var swig = require('swig');
var logger = require('morgan');
var debug = require('debug')('app');
var env = process.env.NODE_ENV || 'development';

app.use(logger('dev'));

// swig view template
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/../client/views');

if (env === 'development') {
    debug('development mode, view cache is disabled');
    swig.setDefaults({ cache: false });
    app.set('view cache', false);
}

require('./routes')(app);

var port = process.env.PORT || 3000;
app.listen(port, function(err) {
    if (err) return console.error(err);
    else console.log('server listening on ', port);
});
