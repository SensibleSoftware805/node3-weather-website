const querystring = require('querystring');
const request = require('request');

const buildMapBoxUrl = (searchTerm, options) =>{
    const urlBase = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    const token = 'pk.eyJ1IjoiY2Fub2dhZGV2ZWxvcGVyZ3V5IiwiYSI6ImNqdHdkNmt2MjBqMjQ0NW82azdwdzlvbmkifQ.SPK8VF3I49DK3Atrnjo0iw';

    if (!options){
        options = {
            access_token: token
        };
    }
    else{
        options['access_token'] = token;
    }

    var url = urlBase + encodeURIComponent(searchTerm) + '.json?' + querystring.stringify(options);
    return url;
};

const geocode = (address, callback) => {

    const mapBoxOptions = { limit: 1 };
    const url = buildMapBoxUrl(address, mapBoxOptions);

    request(
        {
            url,
            json: true
        },
        (err, { body }) => {

            var error;
            var data;

            if (err){
                error = 'Unable to connect to geocoding service';
            } else if (body.message){
                error = 'Error accessing geocoding service: ';
                error += body.message;
            } else {
                const features = body.features;
                if (features.length == 0){
                    error = 'Unable to find location for the search term "' + address + '"';
                } else {

                    const latitude = features[0].center[1];
                    const longitude = features[0].center[0];
                    const location = features[0].place_name;

                    data = {
                        latitude,
                        longitude,
                        location
                    };
                }
            }
            
            callback(error, data);
        }
    );
};

module.exports = geocode;