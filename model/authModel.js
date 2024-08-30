const { getDb } = require('../config/databaseConfig');

class AuthModel {
    constructor() {
    }

    findProfileByUsername = async (username) => {
        const db = getDb();
        return await db.collection('profile').findOne({ username });
    };
    createProfile = async (newProfile) => {
        const db = getDb();
        return await db.collection('profile').insertOne(newProfile);
    };
}

module.exports = AuthModel;