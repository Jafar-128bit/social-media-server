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

    add = async (hashtagData) => await this.getCollection().insertOne(hashtagData,);
    findBySearch = async (searchTerm) => await this.getCollection().find({
        $or: [
            {hashtag: {$regex: searchTerm, $options: 'i'}},]
    },).toArray();
    findByName = async (hashtag) => await this.getCollection().findOne({hashtag: hashtag},);
    update = async (hashtagData = {}) => {
        const {hashtagId, profileId, entityId} = hashtagData;
        return await this.getCollection().updateOne(
            {_id: new ObjectId(hashtagId)},
            {
                $push: {profileId: profileId, entityId: entityId}
            },
        );
    };
    remove = async (hashtagData = {}) => {
        const {hashtagId, profileId, entityId} = hashtagData;
        return await this.getCollection().updateOne(
            {_id: new ObjectId(hashtagId)},
            {
                $pull: {profileId: profileId, entityId: entityId}
            },
        );
    };
    delete = async (hashtagId) => await this.getCollection().deleteOne({_id: new ObjectId(hashtagId)},);
}

module.exports = HashtagModel;
