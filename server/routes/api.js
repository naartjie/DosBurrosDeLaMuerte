'use strict';

var scraper = require('../../scraper');
var debug = require('debug')('api');

module.exports = function(router) {

    router.get('/:spot(durban|capetown)', function(req, res) {
        scraper.getCachedData(req.params.spot)
        .then(function(data) {
            if (data) {
                debug('sending wg data on /api');
            } else {
                console.error('GOT NO DATAZZZ');
                return res.status(500).send('error');
            }
            res.json(data);
        }).catch(function(err) {
            console.error(err.toString(), err.stack);
            res.status(500).send('error');
        })
        .done();
    });
};
