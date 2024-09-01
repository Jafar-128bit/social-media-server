const {getDb} = require('../config/databaseConfig');
const {ObjectId} = require('mongodb');

class HashtagModel {
    constructor() {
        this.collection = null;
    }

    getCollection() {
        if (!this.collection) this.collection = getDb().collection('hashtag');
        return this.collection;
    }

    getList = async (searchTerm) => await this.collection.find({
        $or: [
            {hashtag: {$regex: searchTerm, $options: 'i'}},
        ]
    }).toArray();
    add = async (hashtagData) => await this.getCollection().insertOne(hashtagData);
    findByName = async (hashtag) => await this.getCollection().findOne({hashtag: hashtag});
    update = async (hashtagData = {}) => {
        const {hashtagId, profileId, entityId} = hashtagData;
        return await this.getCollection().updateOne(
            {_id: new ObjectId(hashtagId)},
            {$push: {profileId: profileId}},
            {$push: {entityId: entityId}}
        );
    };
    remove = async (hashtagData = {}) => {
        const {hashtagId, profileId, entityId} = hashtagData;
        return await this.getCollection().updateOne(
            {_id: new ObjectId(hashtagId)},
            {$pull: {profileId: profileId}},
            {$pull: {entityId: entityId}}
        );
    };
    delete = async (hashtagId) => await this.getCollection().deleteOne({_id: new ObjectId(hashtagId)});
}

module.exports = HashtagModel;