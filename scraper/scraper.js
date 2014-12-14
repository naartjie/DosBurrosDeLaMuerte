'use strict';

var Q = require('q');
var convert = require('./converter');
var pullDataz = require('./pull-dataz');
var MINUTE = 60 * 1000;
var cache = null;

exports.start = function run() {

    console.log('pulling fresh data');

    exports.getFreshData()
    .catch(function(err) {
        console.err('error pulling update from the W-G', err.toString(), err.stack);
    })
    .finally(function() {
        Q.delay(2 * MINUTE)
        .then(function() {
            run();
        });
    });
};

exports.getFreshData = function() {
    return pullDataz()
    .then(function(wgData) {
        var data = convert(wgData);
        cache = data;

        return cache;
    });
};

exports.getCachedData = function() {

    if (cache) {
        //jshint newcap:false   
        return Q(cache);
    } else {
        return exports.getFreshData();
    }

};
