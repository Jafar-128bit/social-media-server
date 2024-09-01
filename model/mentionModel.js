const {getDb} = require('../config/databaseConfig');
const {ObjectId} = require('mongodb');

class MentionModel {
    constructor() {
        this.collection = null;
    }

    getCollection() {
        if (!this.collection) this.collection = getDb().collection('mention');
        return this.collection;
    }

    add = async (mentionData) => await this.getCollection().insertOne(mentionData);
    findById = async (mentionProfileId) => await this.getCollection().findOne({mentionedProfileId: mentionProfileId});
    update = async (mentionData = {}) => {
        const {mentionId, profileId, entityId} = mentionData;
        return await this.getCollection().updateOne(
            {_id: new ObjectId(mentionId)},
            {$push: {profileId: profileId}},
            {$push: {entityId: entityId}}
        )
    };
    remove = async (mentionData = {}) => {
        const {mentionId, profileId, entityId} = mentionData;
        return await this.getCollection().updateOne(
            {_id: new ObjectId(mentionId)},
            {$pull: {profileId: profileId}},
            {$pull: {entityId: entityId}}
        )
    };
    delete = async (mentionId) => await this.getCollection().deleteOne({_id: new ObjectId(mentionId)});
}

module.exports = MentionModel;