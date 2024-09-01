const extractSpecialWord = require('../util/extractSpecialWord')

class PostController {
    constructor(serviceObject, processMention, processHashtag) {
        this.serviceObject = serviceObject;
        this.processMention = processMention;
        this.processHashtag = processHashtag;
    }

    #createResponse = (statusCode, message, code, result = null) => {
        return {
            statusCode,
            data: {
                message,
                code,
                result,
            }
        };
    };

    getPostController = async (postId) => {
        try {
            const result = await this.serviceObject.getPostById(postId);
            return this.#createResponse(200, "Found Post", "OK", result);
        } catch (err) {
            return this.#createResponse(err.statusCode || 500, err.message || "An error occurred", err.code || "ERROR");
        }
    };
    getPostListController = async (profileId) => {
        try {
            const result = await this.serviceObject.getPostByProfileId(profileId);
            return this.#createResponse(200, "Found Post List", "OK", result);
        } catch (err) {
            return this.#createResponse(err.statusCode || 500, err.message || "An error occurred", err.code || "ERROR");
        }
    };
    addPostController = async (postData = {}) => {
        try {
            const {hashList, mentionList} = extractSpecialWord(postData.content);
            const resultPost = await this.serviceObject.addPost(postData);
            const resultMention = mentionList.length > 0
                ? await this.processMention(mentionList, resultPost.insertedId.toHexString(), postData.profileId, "post", "addMentionProcess")
                : null;
            const resultHashtag = hashList.length > 0
                ? await this.processHashtag(hashList, resultPost.insertedId.toHexString(), postData.profileId, "post", "addHashtagProcess")
                : null;
            const result = {
                postResult: resultPost,
                hashtagResult: resultHashtag,
                mentionResult: resultMention
            };
            return this.#createResponse(200, "New Post Inserted", "OK", result);
        } catch (err) {
            return this.#createResponse(err.statusCode || 500, err.message || "An error occurred", err.code || "ERROR");
        }
    };
    updatePostLikeController = async (postId, profileId) => {
        try {
            const result = await this.serviceObject.updatePostLike({postId, profileId});
            return this.#createResponse(200, "Post Like update!", "OK", result);
        } catch (err) {
            return this.#createResponse(err.statusCode || 500, err.message || "An error occurred", err.code || "ERROR");
        }
    };
    getRepostController = async (profileId) => {
        try {
            const result = await this.serviceObject.getAllRepost(profileId);
            return this.#createResponse(200, result.length > 0 ? "Found all the repost List" : "No repost list", "OK", result);
        } catch (err) {
            return this.#createResponse(err.statusCode || 500, err.message || "An error occurred", err.code || "ERROR");
        }
    };
    deletePostController = async (postId) => {
        try {
            const getPostData = await this.serviceObject.getPostById(postId);
            const {hashList, mentionList} = extractSpecialWord(getPostData.content);
            const resultMention = mentionList.length !== 0 ?
                await this.processMention(mentionList, postId, getPostData.profileId, "post", "removeMentionProcess")
                : null;
            const resultHashtag = hashList.length !== 0 ?
                await this.processHashtag(hashList, postId, getPostData.profileId, "post", "removeMentionProcess")
                : null;
            const resultPost = await this.serviceObject.deletePost(postId);
            const result = {
                postResult: resultPost,
                hashtagResult: resultHashtag,
                mentionResult: resultMention
            };
            return this.#createResponse(200, "Post deleted!", "OK", result);
        } catch (err) {
            return this.#createResponse(err.statusCode || 500, err.message || "An error occurred", err.code || "ERROR");
        }
    };
}

module.exports = PostController;