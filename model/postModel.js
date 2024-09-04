const {getDb} = require('../config/databaseConfig');
const {ObjectId} = require('mongodb');

class PostModel {
    constructor() {
        this.collection = null;
    }

    getCollection() {
        if (!this.collection) this.collection = getDb().collection('post');
        return this.collection;
    }

    add = async (post) => await this.getCollection().insertOne(post);
    findPostById = async (postId) => await this.getCollection().findOne({_id: new ObjectId(postId)});
    findByProfileId = async (profileId) => await this.getCollection().find({profileId: profileId}).toArray();
    findRepostsByProfileId = async (profileId) => await this.getCollection().find({
        profileId: profileId,
        isRepost: true
    },).toArray();
    addLike = async ({postId, profileId}) => await this.getCollection().updateOne(
        {_id: new ObjectId(postId)},
        {$push: {likeIds: profileId}}
    );
    removeLike = async ({postId, profileId}) => await this.getCollection().updateOne(
        {_id: new ObjectId(postId)},
        {$pull: {likeIds: profileId}}
    );
    delete = async (postId) => await this.getCollection().deleteOne({_id: new ObjectId(postId)});
}

module.exports = PostModel;