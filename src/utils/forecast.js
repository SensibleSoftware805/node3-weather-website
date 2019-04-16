const querystring = require('querystring');

const request = require('request');

const buildDarkSkyUrl = (
    lat,
    long,
    options) => {

    const key = 'e0deb5bc20a5d92a0332b3ba735b100e';

    const urlBase = 'https://api.darksky.net/forecast/';

    var url = urlBase + key + '/' + lat + ',' + long;

    if (options) {
        url += '?' + querystring.stringify(options);
    }
    return url;
};

const forecast = (latitude, longitude, callback) => {

    const url = buildDarkSkyUrl(
        latitude,
        longitude,
        { exclude: 'minutely,alerts,hourly,flags' }
    );

    request(
        { 
            url,
            json: true
        },
        (err, { body }) => {

            var error;
            var data;

            if (err){
                error = 'Unable to connect to weather service';
            } else if (body.error) {
                error = 'unable to find weather for the given location.';
            } else {

                const temperature = body.currently.temperature;
                const summary = body.daily.data[0].summary;
                const chanceRain = body.currently.precipProbability;
                const humidity = body.daily.data[0].humidity;
                const windSpeed = body.daily.data[0].windSpeed;

                data = {
                    temperature,
                    chanceRain,
                    summary,
                    humidity,
                    windSpeed
                };
            }

            callback(error, data);
        }
    );
};

module.exports = forecast;