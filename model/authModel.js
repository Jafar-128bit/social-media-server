const { getDb } = require('../config/databaseConfig');

exports.findProfileByUsername = async (username) => {
    const db = getDb();
    return await db.collection('profile').findOne({ username });
};

exports.createProfile = async (newProfile) => {
    const db = getDb();
    return await db.collection('profile').insertOne(newProfile);
};
