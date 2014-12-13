'use strict';

var express = require('express');
var app = express();


app.get('/api', function(req, res) {
    res.json({
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
    });
});

var port = process.env.PORT || 3000;
app.listen(port, function(err) {
    if (err) return console.error(err);
    else console.log('server listening on ', port);
});
