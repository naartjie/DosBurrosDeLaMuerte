'use strict';

var _ = require('lodash'),
    assert = require('assert'),
    moment = require('moment');

var KMS_IN_KNOT = 1.852;

module.exports = converter;
function converter(wgData) {

    var meat = wgData.fcst['3'];
    var flatArray = convertToFlatArray(meat);

    _(flatArray).each(function(chunk) {
        chunk.dayName = converter.mapDayOffsetToWeekday(chunk.dayOffset);
    });

    var dayNames = _(flatArray)
        .pluck('dayName')
        .unique()
        .value();

    var result = _(dayNames).map(function(dayName) {
        return {
            name: dayName,
            chunks: _(flatArray)
                .filter(function(chunk) {
                    return chunk.dayName === dayName;
                })
                .value(),
        };
    }).value();

    return {
        days: result,
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
        meat.LCDC,
        meat.MCDC,
        meat.HCDC,
        meat.TCDC,
        meat.WINDSPD,
        meat.GUST,
        meat.WINDDIR,
        meat.HTSGW,
        meat.PERPW,
        meat.DIRPW,
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
            cloud: {
                low: Number(data[4]),
                med: Number(data[5]),
                high: Number(data[6]),
                total: Number(data[7]),
            },
            wind: {
                speed: Math.round(data[8] * KMS_IN_KNOT),
                gusts: Math.round(data[9] * KMS_IN_KNOT),
                degrees: data[10],
                cardinal: degreesToCardinal(data[10]),
            },

            wave: {
                height: data[11],
                period: Math.round(data[12]),
                degrees: data[13],
                cardinal: degreesToCardinal(data[13]),
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
