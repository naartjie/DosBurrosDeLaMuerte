'use strict';

exports.convert = require('./converter');
exports.pullDataz = require('./scraper');


var data = require('../test/fixtures/wg-data');
exports.getCachedData = function() {
    return exports.convert(data.wgJson);
};
