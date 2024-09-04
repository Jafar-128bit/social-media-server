const serviceRegistrationMiddleware = (isc, serviceMap) => {
    return (req, res, next) => {
        Object.keys(serviceMap).forEach(serviceName => {
            isc.registerServiceAddress(serviceName, serviceMap[serviceName]);
        });
        next();
    };
};

module.exports = serviceRegistrationMiddleware;