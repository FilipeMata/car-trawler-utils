'use strict';

var CarTrawlerUtils = require('car-trawler-utils');

async function run() {
    console.log('Starting...');
    const carTrawler = new CarTrawlerUtils();

    console.log('Setting vehicles list by requesting http://www.cartrawler.com/ctabe/cars.json');
    await carTrawler.setVehiclesByAPIRequest();

    console.log('Getting a new list from the existent one removing duplicate car models...');
    carTrawler.getVehiclesListWithoutDuplicatedVehicleModels();
    console.dir(carTrawler.vehiclesList, {depth: null});
}

run();
