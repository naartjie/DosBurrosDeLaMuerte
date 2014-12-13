'use strict';

exports.convert = require('./converter');
exports.pullDataz = require('./scraper');

var data = exports.convert(require('../test/fixtures/wg-data').wgJson);

exports.getCachedData = function() {
    return data;
};
