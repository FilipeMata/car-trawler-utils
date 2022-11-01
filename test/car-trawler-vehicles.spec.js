/* eslint-disable no-undef */
'use strict';

const should = require('should');
const sinon = require('sinon');
const _ = require('lodash');
const CarTrawlerVehicles = require('../lib/car-trawler-vehicles');

/* Mocks */
const carsMock = require('./cars.mock.json');
const APIResponseMock = require('./api-response-mock.json');
const carsWithoutDuplicationMock = require('./cars-without-duplication.mock.json');
const carsWithoutDuplicationAndUnavaiableMock = require('./cars-without-duplication-and-unavaiable.mock.json');
const cheapestOfEachCarModel = require('./cheapest-of-each-car-model.mock.json');
const cheapestAutomaticCarMock = require('./cheapest-automatic-car.mock.json');
const filteredCarsWithCDARCodeMock = require('./filtered-cars-with-CDAR-code.mock.json');
const filteredCarsWithNonExistentCodeMock = require('./filtered-cars-with-nonexistent-code.mock.json');
const carsSortedByVendorsAndPriceMock = require('./cars-sorted-by-vendors-and-price.mock.json');

let carTrawler;

let httpClient = {
    get: sinon.stub()
};

describe('CarTrawlerVehicles Tests', () => {

    beforeEach(() => {
    
        httpClient.get
            .withArgs('http://www.cartrawler.com/ctabe/cars.json')
            .resolves(APIResponseMock);

        carTrawler = new CarTrawlerVehicles(httpClient);
        carTrawler.setVehiclesList(carsMock);
    });

    describe('setVehiclesByAPIRequest Tests', async () => {
        it('should set vehicles list through a non empty API response list', async () => {
            carTrawler.setVehiclesList(null);
            await carTrawler.setVehiclesByAPIRequest();

            should(_.isEqual(carTrawler.vehiclesList, carsMock)).be.true();
        });

        it('should set vehicles list with null when API response is empty', async () => {
            httpClient.get
                .withArgs('http://www.cartrawler.com/ctabe/cars.json')
                .resolves({data: null});

            carTrawler = new CarTrawlerVehicles(httpClient);

            await carTrawler.setVehiclesByAPIRequest();

            should(carTrawler.vehiclesList).be.undefined();
        });
    });

    describe('getVehiclesListWithoutDuplicatedVehicleModels Tests', () => {
        it('should remove duplicate models from list when they exist - keeping the unavaiable vehicles', () => {
            const list = carTrawler.getVehiclesListWithoutDuplicatedVehicleModels(false);

            should(_.isEqual(list, carsWithoutDuplicationMock)).be.true();
        });

        it('should remove duplicate models from list when they exist - removing the unavaiable vehicles as well', () => {
            const list = carTrawler.getVehiclesListWithoutDuplicatedVehicleModels();

            should(_.isEqual(list, carsWithoutDuplicationAndUnavaiableMock)).be.true();
        });
    });


    describe('listCheapestOfEachVehiclesModel Tests', () => {
        it('should display cheapest of each car model', () => {
            const cheapestList = carTrawler.listCheapestOfEachVehiclesModel();

            should(_.isEqual(cheapestList, cheapestOfEachCarModel)).be.true();
        });
    });

    describe('getCheapestVehicleByType Tests', () => {
        it('should get cheapest automatic car when args are: @TransmissionType, Automatic', () => {
            const cheapest = carTrawler.getCheapestVehicleByType('@TransmissionType', 'Automatic');

            should(_.isEqual(cheapest, cheapestAutomaticCarMock)).be.true();
        });

        it('should return null when the type is not existent on the list', () => {
            const cheapest = carTrawler.getCheapestVehicleByType('@TransmissionType', 'Manual');

            should(cheapest).be.null();
        });

        it('should throws when type key is invalid', () => {
            try {     
                carTrawler.getCheapestVehicleByType('@TireType', 'X');
                throw('Test Failed');
            } catch(err) {
                should(err.message).eql('Invalid Type key');
            }
        });
    });

    describe('filterVehiclesByCode Tests', () => {
        it('should return only one car when CDAR code filter is applied', () => {
            const filtered = carTrawler.filterVehiclesByCode('CDAR');

            should(_.isEqual(filtered, filteredCarsWithCDARCodeMock)).be.true();
        });

        it('should return no car when a invalid code filter is applied', () => {
            const filtered = carTrawler.filterVehiclesByCode('INVALID_CODE');

            should(_.isEqual(filtered, filteredCarsWithNonExistentCodeMock)).be.true();
        });
    });

    describe('sortByCorporate and sortByPrice', () => {
        it('should sort cars list by vendor and price', () => {

            carTrawler.sortByCorporate();
            carTrawler.sortVehiclesByPriceWithinEachVendor();

            should(JSON.stringify(carTrawler.vehiclesList)).eql(JSON.stringify(carsSortedByVendorsAndPriceMock));
        });
    });
});