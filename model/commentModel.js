const {ObjectId} = require('mongodb');
const {getDb, client} = require("../config/databaseConfig");

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
    findByProfileId = async (profileId) => await this.getCollection().find({profileId: profileId}).toArray();
    findByCommentId = async (commentId) => await this.getCollection().findOne({_id: new ObjectId(commentId)});
    addLike = async ({commentId, profileId}) => await this.getCollection().updateOne(
        {_id: new ObjectId(commentId)},
        {$push: {profileId: profileId}}
    );
    removeLike = async ({commentId, profileId}) => await this.getCollection().updateOne(
        {_id: new ObjectId(commentId)},
        {$pull: {profileId: profileId}}
    );
    delete = async (commentId) => await this.getCollection().deleteOne({_id: new ObjectId(commentId)});
    deleteByPostId = async (postId) => await this.getCollection().delete({postId: postId})
    startTransactionSession = async () => await client.startSession();
}

module.exports = CommentModel;