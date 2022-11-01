'use strict';

const CarTrawlerUtils = require('car-trawler-utils');

async function run() {
    console.log('Starting...');
    const carTrawler = new CarTrawlerUtils();

    console.log('Setting vehicles list by requesting http://www.cartrawler.com/ctabe/cars.json');
    await carTrawler.setVehiclesByAPIRequest();

    console.log('-------------------------------------------------------');
    console.log('Getting a new list from the existent one removing duplicate car models...');
    const listWithoutDuplicates = carTrawler.getVehiclesListWithoutDuplicatedVehicleModels();
    console.dir(listWithoutDuplicates, {depth: null});

    console.log('-------------------------------------------------------');
    console.log('Getting the cheapest automatic car...');
    const cheapestAutomatic = carTrawler.getCheapestVehicleByType('@TransmissionType', 'Automatic');
    console.dir(cheapestAutomatic, {depth: null});

    console.log('-------------------------------------------------------');
    console.log('Filtering vehicles by CDAR code');
    const filteredByCDARCode = carTrawler.filterVehiclesByCode('CDAR');
    console.dir(filteredByCDARCode, {depth: null});

    console.log('-------------------------------------------------------');
    console.log('Sorting vehicles first by corporate and then by price (within each vendor)');
    carTrawler.sortByCorporate();
    carTrawler.sortVehiclesByPriceWithinEachVendor();
    console.dir(carTrawler.vehiclesList, {depth: null});
}

run();
