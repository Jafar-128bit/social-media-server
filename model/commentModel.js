const {ObjectId} = require('mongodb');
const {getDb} = require("../config/databaseConfig");

class CommentModel {
    constructor() {
        this.collection = null;
    }

    getCollection() {
        if (!this.collection) this.collection = getDb().collection('comment');
        return this.collection;
    }

    add = async (commentData) => await this.getCollection().insertOne(commentData);
    findByPostId = async (postId) => await this.getCollection().find({postId: postId}).toArray();
    findByProfileId = async (profileId) => await this.getCollection().find({postId: profileId}).toArray();
    addLikeById = async ({commentId, profileId}) => await this.getCollection().updateOne(
        {_id: new ObjectId(commentId)},
        {$push: {profileId: profileId}},
    );
    removeLikeById = async ({commentId, profileId}) => await this.getCollection().updateOne(
        {_id: new ObjectId(commentId)},
        {pull: {profileId: profileId}},
    );
    deleteById = async (commentId) => await this.getCollection().deleteOne({_id: new ObjectId(commentId)});
}

module.exports = CommentModel;