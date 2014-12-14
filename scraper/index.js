'use strict';

var scraper = require('./scraper');
scraper.start();

module.exports = {
    getCachedData: scraper.getCachedData,
    convert: require('./converter'),
};
