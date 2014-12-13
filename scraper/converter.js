'use strict';

var _ = require('lodash'),
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
    return daysToOffset(meat.hr_weekday).map(function(dayOffset) {
        return { dayOffset: dayOffset };
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
