'use strict';

var express = require('express'),
    _       = require('lodash'),
    routes  = require('node-require-directory')(__dirname);

module.exports = function(app) {
    _(routes).omit('index')
    .each(function(route, key) {
        var router = express.Router();
        route(router);
        app.use('/' + key, router);
    });

    app.get('/:spot(durban|capetown)', function(req, res) {
        res.render('spot.html', { spot: req.params.spot });
    });

    app.get('/', function(req, res) {
        res.redirect('/durban');
    });

    app.use(express.static(__dirname + '/../../client/'));

};
