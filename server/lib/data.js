'use strict';

module.exports = {
    days: [
        {
            name: 'Today',
            chunks: [{
                hour: '7am',
                temp: 24,
                precipitation: 0.8,
                cloudcover: [0.8, 0.6, 0],
                wind: {
                    speed: 5,
                    gusts: 12,
                    direction: {
                        degrees: 215,
                        cardinal: 'NW',
                    }
                }
            },
            {
                hour: '10am',
                temp: 26,
                precipitation: 0.5,
                cloudcover: [0.4, 0.2, 0],
                wind: {
                    speed: 10,
                    gusts: 18,
                    direction: {
                        degrees: 215,
                        cardinal: 'NW',
                    }
                }
            }]
        }
    ]
};
