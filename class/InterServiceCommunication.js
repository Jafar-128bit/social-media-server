class InterServiceCommunication {
    constructor() {
        this.serviceAddresses = {};
    }

    registerServiceAddress(serviceName, serviceAddress) {
        if (!this.serviceAddresses[serviceName]) {
            this.serviceAddresses[serviceName] = serviceAddress;
        }
    }

    resolveService(serviceName) {
        const serviceAddress = this.serviceAddresses[serviceName];
        if (serviceAddress) return serviceAddress;
        throw new Error(`${serviceAddress} Service not found in the Network!`);
    }

    removeServiceAddress(serviceName) {
        delete this.serviceAddresses[serviceName];
    }

    getISC() {
        return this.serviceAddresses;
    }
}

// Freeze the instance to prevent modifications
const isc = new InterServiceCommunication();
Object.freeze(isc);

module.exports = isc;
