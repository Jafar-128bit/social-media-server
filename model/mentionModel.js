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

    add = async (mentionData, option = {}) => await this.getCollection().insertOne(mentionData, option);
    findById = async (mentionProfileId, option = {}) => await this.getCollection().findOne({mentionedProfileId: mentionProfileId}, option);
    update = async (mentionData = {}, option = {}) => {
        const {mentionId, profileId, entityId} = mentionData;
        return await this.getCollection().updateOne(
            {_id: new ObjectId(mentionId)},
            {
                $push: {profileId: profileId, entityId: entityId}
            },
            option
        );
    };
    remove = async (mentionData = {}, option = {}) => {
        const {mentionId, profileId, entityId} = mentionData;
        return await this.getCollection().updateOne(
            {_id: new ObjectId(mentionId)},
            {
                $pull: {profileId: profileId, entityId: entityId}
            },
            option
        );
    };
    delete = async (mentionId, option = {}) => await this.getCollection().deleteOne({_id: new ObjectId(mentionId)}, option);
}

module.exports = MentionModel;
