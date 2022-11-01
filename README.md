# car-trawler-utils

> A nodejs module containing CarTrawler API helper functionality.


## Instalation

```bash
$npm install https://github.com/FilipeMata/car-trawler-utils
```

## Basic Usage

Import module and instanciate it:

```js
const CarTrawlerUtils = require('car-trawler-utils');
const carTrawler = new CarTrawlerUtils();
```

It is possible to set the vehicles list by requesting http://www.cartrawler.com/ctabe/cars.json endpoint

```js
await carTrawler.setVehiclesByAPIRequest();
```
or directly passing a vechiles list as argument to setVechiclesList method

```js
const vehiclesList = {/*...*/} //this list should follow exactly the same pattern of file cars.mock.json under test folder 
await carTrawler.setVehiclesList(vehiclesList);
```

To get a new list with the duplicate vehicles models removed, do:
```js
const withouDuplications = carTrawler.getVehiclesListWithoutDuplicatedVehicleModels();
console.dir(withouDuplications, {depth: null});
```

If you want to remove duplications but ignoring the unavailable vehicles, do the following:
```js
const withouDuplications = carTrawler.getVehiclesListWithoutDuplicatedVehicleModels(false);
console.dir(withouDuplications, {depth: null});
```

To display cheapest of each car type, do the following:

```js
const cheapestList = carTrawler.listCheapestOfEachVehiclesModel();
console.dir(cheapestList, {depth: null});
```

To get the cheapest vehicle by type, you must call `getCheapestVehicleByTpe` method passing the type key and its value as argument. 

The type keys must be:
```
'@TransmissionType', 
'@FuelType', 
'@DriveType'
```

E.g. by running the following command you retrieve the cheapest automatic car.

```js
const cheapest = carTrawler.getCheapestVehicleByType('@TransmissionType', 'Automatic');
console.dir(cheapest, {depth: null});
```

To filter vehicles by code, you must call `filterVehiclesByCode` method passing the code as argument. E.g. by running the follwing command you filter all cars with `CDAR`code from the vehicles list:
```js
const filtered = carTrawler.filterVehiclesByCode('CDAR');
console.dir(filtered, {depth: null});
```

To sort vehicles list by vendor/corporate, do the following:
```js
const sorted = carTrawler.sortByCorporate();
console.dir(sorted, {depth: null});
```

Inside each vendor's group is also possible to sort vehicles by price (not consider currency changes). Just do the following:
```js
const sorted = carTrawler.sortVehiclesByPriceWithinEachVendor();
console.dir(sorted, {depth: null});
```

## Running Unit Tests

To run unit tests, clone this repo and run test script:

```bash
$ git clone git@github.com:FilipeMata/car-trawler-utils.git
$ npm install
$ npm run test
```

To get coverage statistcs run:
```bash
$ npm run test:coverage
```

As result, a `index.html` file will be generated under `coverage` folder. Just open it in a browser.

## Running code quality validator

To run eslint validator, run:

```bash
$ cd node_modules/.bin/eslint lib/
```

## Running Example Application

To run examples, clone this repo e install the dependencies:

```bash
$ git clone git@github.com:FilipeMata/car-trawler-utils.git
$ cd car-trawler-utils/exec
$ npm install
```

Then, run the main file:

```bash
$ node main.js
```

