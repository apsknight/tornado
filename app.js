#!/usr/bin/env node
const yargs = require('yargs');
const axios = require('axios');
const chalk = require('chalk');

const argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'address',
            describe: 'Address to fetch weather for',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

var geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(argv.address)}`

axios.get(geocodeURL).then((response) => {
    if (response.data.status === 'ZERO_RESULTS') {
        throw new Error('address not found');
    }
    else if (response.data.results[0].geometry === undefined) {
        throw new Error('Geolocation API limit exceeded.');
    }
    var latitude = response.data.results[0].geometry.location.lat;
    var longitude = response.data.results[0].geometry.location.lng;
    weatherURL = `https://api.darksky.net/forecast/6984a9f3e0803b2f24dfd87e98dd7940/${latitude},${longitude}?units=si`,
    console.log(chalk.blue('Finding Weather for: ') + chalk.cyan(response.data.results[0].formatted_address));
    console.log(chalk.white('-------'));
    return axios.get(weatherURL);
}).then((response) => {
    var currentTemperature = response.data.currently.temperature;
    var currentSummary = response.data.currently.summary;
    var hourlySummary = response.data.hourly.summary;
    var dailySummary = response.data.daily.summary;
    console.log(chalk.blue('Current temperature is: ') + chalk.yellow(currentTemperature + '°C') + chalk.blue(' and the weather is ') + chalk.yellow(currentSummary.toLowerCase()) + chalk.blue('.'));
    console.log(chalk.blue('Weather forecast for today: ' + chalk.yellow(hourlySummary)));
    console.log(chalk.blue('Weather forecast for this week: ' + chalk.yellow(dailySummary)));
}).catch((e) => {
    console.log(e.message);
});