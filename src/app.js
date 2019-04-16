const path = require('path');
const express = require('express');
const hbs = require('hbs');

const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode');

const app = express();

const port = process.env.PORT || 3000;

// define paths for express config
const publicDir = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// setup handle bars engine, views, and partials location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// setup static directory
app.use(express.static(publicDir));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Matt Musgrove'
    });
});

app.get('/about', (req, res) => {
    res.render(
        'about', {
            title: 'About Me',
            name: 'Matt Musgrove'
        });
});

app.get('/help', (req, res) => {
    res.render(
        'help', {
            title: 'Help',
            helpMessage: 'This is a help message',
            name: 'Matt Musgrove'
        }
    );
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        res.send({ error: 'You must provide an address' });
        return;
    }

    geocode(req.query.address, (error, {
        latitude,
        longitude,
        location
    } = {}) => {
        if (error) {
            res.send({ error });
            return;
        }

        forecast(latitude, longitude, (error, {
            summary,
            temperature,
            chanceRain
        } = {}) => {
            if (error) {
                res.send({ error });
                return;
            }

            res.send({
                summary,
                temperature,
                chanceRain,
                location,
                address: req.query.address
            });
        });
    });

});

app.get('/products', (req, res) => {

    if (!req.query.search) {
        res.send({
            errorMessage: 'You must provide a search term.'
        });
        return;
    }

    console.log(req.query);

    res.send({
        products: []
    });
});

app.get('/help/*', (req, res) => {
    res.render(
        'page-not-found', {
            title: '404 Error',
            errorMessage: 'Help article not found',
            name: 'Matt Musgrove'
        }
    );
});

app.get('*', (req, res) => {
    res.render(
        'page-not-found', {
            title: '404 Error',
            errorMessage: 'Page not found',
            name: 'Matt Musgrove'
        }
    );
});

app.listen(port, () => {
    console.log('Server is up on port ' + port + '.');
});