const extractSpecialWord = require('../util/extractSpecialWord');

class PostController {
    constructor(serviceObject) {
        this.serviceObject = serviceObject;
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

    addPostController = async (postData = {}) => {
        try {
            const result = await this.serviceObject.createPostService(postData);
            return this.#createResponse(200, "New Post Inserted", "OK", result);
        } catch (err) {
            return this.#createResponse(err.statusCode || 500, err.message || "An error occurred", err.code || "ERROR");
        }
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
            const result = await this.serviceObject.deletePostService(postId);
            console.log(result);
            return this.#createResponse(200, "Post deleted!", "OK", result);
        } catch (err) {
            return this.#createResponse(err.statusCode || 500, err.message || "An error occurred", err.code || "ERROR");
        }
    };
}

module.exports = PostController;