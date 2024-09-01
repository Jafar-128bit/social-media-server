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

    findPostById = async (postId) => await this.getCollection().findOne({_id: new ObjectId(postId)});
    findPostByProfileId = async (profileId) => await this.getCollection().find({profileId: profileId}).toArray();
    insertPost = async (post) => await this.getCollection().insertOne(post);
    updatePostLikeById = async (postId, profileId) => await this.getCollection().updateOne(
        {_id: new ObjectId(postId)},
        {$addToSet: {likeIds: profileId}}
    );
    deletePostById = async (postId) => await this.getCollection().deleteOne({_id: new ObjectId(postId)});
    findReposts = async (profileId) => await this.getCollection().find({profileId: profileId, isRepost: true},).toArray();
}

module.exports = PostModel;