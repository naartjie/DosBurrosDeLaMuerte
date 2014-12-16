'use strict';

var urls = {
    durban: 'http://www.windguru.cz/int/index.php?sc=4865',
    capetown: 'http://www.windguru.cz/int/index.php?sc=91',
};

var http = require('q-io/http');

module.exports = function pullDataz(spot) {

    var _start = 'var wg_fcst_tab_data_1 = ';
    var _end   = '};';

    return http.read({ url: urls[spot] })
    .then(function(body) {
        var text = body.toString();
        var start = text.indexOf(_start) + _start.length;
        var end = text.indexOf(_end, start) + 1;
        var jsonStr = text.substring(start, end);

        return JSON.parse(jsonStr);
    });
};
