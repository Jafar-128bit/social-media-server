const {getDb} = require('../config/databaseConfig');
const {ObjectId} = require('mongodb');

class PostModel {
    constructor() {
        this.collection = getDb().db.collection('post');
    }

    findPostById = async (postId) => await this.collection.findOne({_id: new ObjectId(postId)});
    findPostByProfileId = async (profileId) => await this.collection.find({profileId: profileId}).toArray();
    insertPost = async (post) => await this.collection.insertOne(post);
    updatePostLikeById = async (postId, profileId) => await this.collection.updateOne(
        {_id: new ObjectId(postId)},
        {$addToSet: {likeIds: profileId}}
    );
    deletePostById = async (postId) => await this.collection.deleteOne({_id: new ObjectId(postId)});
    findReposts = async (profileId) => await this.collection.find({profileId: profileId, isRepost: true},).toArray();
}

module.exports = PostModel;