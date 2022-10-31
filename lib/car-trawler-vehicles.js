'use strict';

module.exports = class CarTrawlerVehicles {
    constructor(httpClient) {
        this.setVehiclesList(null);
        this.httpClient = httpClient;
    }

    async setVehiclesByAPIRequest() {
        const response = await this.httpClient.get('http://www.cartrawler.com/ctabe/cars.json');

        if (!response.data || !Array.isArray(response.data)) {
            response.data = [ response.data ];
        }

        this.vehiclesList = response.data[0]?.VehAvailRSCore;
    }

    setVehiclesList(vehiclesList) {
        this.vehiclesList =  vehiclesList;
    }

    getVehiclesListWithoutDuplicatedVehicleModels() {
        const models = {};
        const listClone = this.vehiclesList ? JSON.parse(JSON.stringify(this.vehiclesList)) : null;

        listClone?.VehVendorAvails.forEach((vendor) => {
            for(let i=0; i < vendor?.VehAvails.length; i++) {
                const car = vendor.VehAvails[i];
                
                if (car["@Status"] !== 'Available') {
                    continue;
                }
    
                if (!models[car.Vehicle.VehMakeModel["@Name"]]) {
                    models[car.Vehicle.VehMakeModel["@Name"]] = true;
                } else {
                    vendor.VehAvails.splice(i, 1);
                }
            }
        });

        return listClone;
    }

    getCheapestVehicleByType(typeKey, typeValue) {
        let cheapest = null;

        const allowedTypeKeys = [
            '@TransmissionType', 
            '@FuelType', 
            '@DriveType'
        ];

        if(!allowedTypeKeys.includes(typeKey)) {
            throw new Error('Invalid Type key');
        }

        this.vehiclesList?.VehVendorAvails.forEach((vendor) => {
            for(let i=0; i < vendor?.VehAvails.length; i++) {
                const car = vendor.VehAvails[i];

                if (car.Vehicle[typeKey] !== typeValue) {
                    continue;
                }

                if(cheapest == null || +car.TotalCharge['@RateTotalAmount'] <= cheapest.TotalCharge['@RateTotalAmount']) {
                    cheapest = car;
                }
            }
        });

        return cheapest;
    }

    filterVehiclesByCode(code) {
        const filtered = JSON.parse(JSON.stringify(this.vehiclesList));

        for (let i = 0; i < filtered?.VehVendorAvails?.length; i++) {
            filtered.VehVendorAvails[i].VehAvails = filtered.VehVendorAvails[i]?.VehAvails?.filter((v) => v.Vehicle['@Code'] == code);
        }

        filtered.VehVendorAvails = filtered.VehVendorAvails.filter((v) => v.VehAvails.length > 0);

        return filtered;
    }

    sortByCorporate() {
        this.vehiclesList?.VehVendorAvails?.sort((v1, v2) => {
            return v1.Vendor['@Name'].localeCompare(v2.Vendor['@Name'])
        });

        return this.vehiclesList;
    }

    sortVehiclesByPriceWithinEachVendor() {
        for (let i = 0; i < this.vehiclesList?.VehVendorAvails?.length; i++) {
            this.vehiclesList.VehVendorAvails[i].VehAvails?.sort((v1, v2) => {
                return parseFloat(v1.TotalCharge['@RateTotalAmount']) - parseFloat(v2.TotalCharge['@RateTotalAmount']);
            });
        }

        return this.vehiclesList;
    }
}