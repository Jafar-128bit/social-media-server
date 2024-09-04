const {getDb} = require('../config/databaseConfig');

class AuthModel {
    constructor() {
        this.collection = null;
    }

    getCollection() {
        if (!this.collection) this.collection = getDb().collection('profile');
        return this.collection;
    }

    findProfileByUsername = async (username) => await this.getCollection().findOne({username: username});
    createProfile = async (newProfile) => await this.getCollection().insertOne(newProfile);
}

module.exports = AuthModel;