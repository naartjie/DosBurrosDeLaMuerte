'use strict';

var fs = require('fs');
var wgJson = JSON.parse(fs.readFileSync(__dirname + '/wg_data.json'));

module.exports = {
    wgJson: wgJson,
    meat: wgJson.fcst['3'],
};
