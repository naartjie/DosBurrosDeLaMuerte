'use strict';

var mocha    = require('mocha'),
    describe = mocha.describe,
    it       = mocha.it,
    fs       = require('fs'),
    moment   = require('moment'),
    _        = require('lodash'),
    expect   = require('chai').expect;

describe('converter', function() {

    var converter = require('../scraper').convert;

    it('should convert hr_weekday array to offset', function() {

        var hr_weekday = [
            6,6,6,6,6,6,
            0,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1,
            2,2,2,2,2,2,2,2,
            3,3,3,3,3,3,3,3,
            4,4,4,4,4,4,4,4,
            5,5,5,5,5,5,5,5,
            6,6,6,6,6,6,6
        ];

        var result = converter.daysToOffset(hr_weekday);
        expect( result ).to.have.length(hr_weekday.length);
        expect( _(result).unique().value() ).to.eql([0,1,2,3,4,5,6,7]);
    });

    it('should map day offset to weekday', function() {

        expect( converter.mapDayOffsetToWeekday(0) ).to.equal('Today');
        expect( converter.mapDayOffsetToWeekday(1) ).to.equal('Tomorrow');

        expect( converter.mapDayOffsetToWeekday(2) ).to.equal(
            moment().add(2, 'days').format('dddd')
        );

        var todayIsSunday = moment().isoWeekday(0);

        expect( converter.mapDayOffsetToWeekday(0, todayIsSunday) ).to.equal('Today');
        expect( converter.mapDayOffsetToWeekday(1, todayIsSunday) ).to.equal('Tomorrow');

        expect( converter.mapDayOffsetToWeekday(3, todayIsSunday) ).to.equal('Wednesday');
        expect( converter.mapDayOffsetToWeekday(4, todayIsSunday) ).to.equal('Thursday');
        expect( converter.mapDayOffsetToWeekday(5, todayIsSunday) ).to.equal('Friday');
        expect( converter.mapDayOffsetToWeekday(6, todayIsSunday) ).to.equal('Saturday');
        expect( converter.mapDayOffsetToWeekday(7, todayIsSunday) ).to.equal('Sunday');
    });

    it('should convert to flat array', function() {

        var meat = require('./fixtures/meat.js');
        var result = converter.convertToFlatArray(meat);

        expect( result ).to.have.length( meat.hr_weekday.length );

        expect( result[0].dayOffset ).to.equal(0);
        expect( result.slice(-1)[0].dayOffset ).to.equal(7);

    });

    it('should digest JSON data', function() {

        var wgJson = JSON.parse(fs.readFileSync(__dirname + '/fixtures/wg_data.json'));

        var dosBurrosData = converter(wgJson);

        expect(dosBurrosData).to.have.property('days');

        var today = dosBurrosData.days[0];

        expect(today.name).to.be.equal('Today');
        // expect(today.chunks).to.have.length(6);

        // expect(today.chunks[0]).to.be.equal({
        //     hour: '7am',
        //     temp: 24,
        //     precipitation: 0.8,
        //     cloudcover: [0.8, 0.6, 0],
        //     wind: {
        //         speed: 5,
        //         gusts: 12,
        //         direction: {
        //             degrees: 215,
        //             cardinal: 'NW',
        //         }
        //     }
        // });

        // expect(today.chunks[4]).to.be.equal({
        //     hour: '7am',
        //     temp: 24,
        //     precipitation: 0.8,
        //     cloudcover: [0.8, 0.6, 0],
        //     wind: {
        //         speed: 5,
        //         gusts: 12,
        //         direction: {
        //             degrees: 215,
        //             cardinal: 'NW',
        //         }
        //     }
        // });
    });
});
