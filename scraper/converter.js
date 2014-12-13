'use strict';

var _ = require('lodash'),
    assert = require('assert'),
    moment = require('moment');

module.exports = converter;
function converter(wgData) {

    var meat = wgData.fcst['3'];

    var todaysNumber = meat.hr_weekday[0];

    // 6666,0000000,11111111,22222222,33333333,444444,555555,66666

    // to offset
    // 00000,1111,22222,33333,44444,55555,6666

    // console.log(weekdays);

    return {
        days: [{
            name: 'Today',
            chunks: []
        }]
    };
}

converter.mapDayOffsetToWeekday = (function() {
    var lookup = {
        0: 'Today',
        1: 'Tomorrow',
        default: function(day, overrideTodayForTesting) {
            return moment(overrideTodayForTesting).add(day, 'days').format('dddd');
        }
    };
    return function(dayOffset, overrideTodayForTesting) {
        return lookup[dayOffset] || lookup.default(dayOffset, overrideTodayForTesting);
    };
})();

converter.convertToFlatArray = convertToFlatArray;
function convertToFlatArray (meat) {

    var arrays = [
        daysToOffset(meat.hr_weekday),
        meat.hr_h,
        meat.TMP,
        meat.APCP,
        meat.WINDDIR,
    ];

    assert(_(arrays).all(function(arr) { 
        return arr.length === arrays[0].length;
    }));

    return _.zip(arrays).map(function(data) {
        return { 
            dayOffset: data[0],
            hour: moment().set('hours', data[1]).format('ha'),
            temperature: Math.round(data[2]),
            precipitation: Number(data[3]),
            wind: {
                degrees: data[4],
                cardinal: degreesToCardinal(data[4]),
            }
        };
    });
}

converter.daysToOffset = daysToOffset;
function daysToOffset(dayNumArr) {
    var todayNum = dayNumArr[0];
    var len = dayNumArr.length;

    return dayNumArr.map(function(num, i) {
        var result = (num - todayNum + 7) % 7;
        // checking if we're past halfway haaack does feel a bit hacky
        // but we *ARE* doing a hackathon ;-P
        return (result === 0 && i > len / 2 ? 7 : result);
    });
}

var cardinals = [
    'N', 'NNE', 'NE', 
    'ENE', 'E', 'ESE', 
    'SE', 'SSE', 'S', 
    'SSW', 'SW', 'WSW', 
    'W', 'WNW', 'NW', 
    'NNW', 'N'
];
converter.degreesToCardinal = degreesToCardinal;
function degreesToCardinal(degrees) {
    return cardinals[Math.floor(((degrees + 11.25) % 360) / 22.5)];
}
