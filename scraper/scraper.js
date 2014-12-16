'use strict';

var Q = require('q');
var convert = require('./converter');
var pullDataz = require('./pull-dataz');
var MINUTE = 60 * 1000;
var cache = {};

exports.start = function run() {

    console.log('pulling fresh data');

    Q.all(
        exports.pullFreshData('capetown'),
        exports.pullFreshData('durban')
    )
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

exports.pullFreshData = function(spot) {
    pullDataz(spot)
    .then(function(wgData) {
        cache[spot] = convert(wgData);
        return cache[spot];
    });
};

exports.getCachedData = function(spot) {
    if (cache[spot]) {
        //jshint newcap:false   
        return Q(cache[spot]);
    } else {
        return exports.pullFreshData(spot);
    }
};
