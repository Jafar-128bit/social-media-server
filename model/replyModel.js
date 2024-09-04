const {ObjectId} = require('mongodb');
const {getDb} = require("../config/databaseConfig");

class ReplyModel {
    constructor() {
        this.collection = null;
    }

    getCollection() {
        if (!this.collection) this.collection = getDb().collection('reply');
        return this.collection;
    }

    add = async (replyData = {}) => await this.getCollection().insertOne(replyData);
    findByCommentId = async (commentId) => await this.getCollection().find({commentId: commentId}).toArray();
    findByProfileId = async (profileId) => await this.getCollection().find({profileId: profileId}).toArray();
    findByReplyId = async (replyId) => await this.getCollection().findOne({_id: new ObjectId(replyId)});
    addLike = async ({replyId, profileId}) => await this.getCollection().updateOne(
        {_id: new ObjectId(replyId)},
        {$push: {profileId: profileId}}
    );
    removeLike = async ({replyId, profileId}) => await this.getCollection().updateOne(
        {_id: new ObjectId(replyId)},
        {$pull: {profileId: profileId}}
    );
    delete = async (replyId) => await this.getCollection().deleteOne({_id: new ObjectId(replyId)});
}

module.exports = ReplyModel;