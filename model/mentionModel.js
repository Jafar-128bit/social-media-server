const {getDb} = require('../config/databaseConfig');
const {ObjectId} = require('mongodb');

class MentionModel {
    constructor() {
        this.collection = getDb().db.collection('mention');
    }

    add = async (mentionData) => await this.collection.insertOne(mentionData);
    findById = async (mentionProfileId) => await this.collection.findOne({mentionedProfileId: mentionProfileId});
    update = async (mentionData = {}) => {
        const {mentionId, profileId, entityId} = mentionData;
        return await this.collection.updateOne(
            {_id: new ObjectId(mentionId)},
            {$push: {profileId: profileId}},
            {$push: {entityId: entityId}}
        )
    };
    remove = async (mentionData = {}) => {
        const {mentionId, profileId, entityId} = mentionData;
        return await this.collection.updateOne(
            {_id: new ObjectId(mentionId)},
            {$pull: {profileId: profileId}},
            {$pull: {entityId: entityId}}
        )
    };
    delete = async (mentionId) => await this.collection.deleteOne({_id: new ObjectId(mentionId)});
}

module.exports = MentionModel;