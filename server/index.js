'use strict';

var express = require('express');
var app = express();

require('./routes')(app);

var port = process.env.PORT || 3000;
app.listen(port, function(err) {
    if (err) return console.error(err);
    else console.log('server listening on ', port);
});
