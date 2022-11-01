'use strict';

const axios = require('axios');
const CarTrawlerVehicles = require('./lib/car-trawler-vehicles');

module.exports = function () {
    return new CarTrawlerVehicles(axios);
};
