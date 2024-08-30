const extractSpecialWord = require('../util/extractSpecialWord')

class PostController {
    constructor(serviceObject, processMention, processHashtag) {
        this.serviceObject = serviceObject;
        this.processMention = processMention;
        this.processHashtag = processHashtag;
    }

    getPostController = async (postId) => {
        try {
            const result = await this.serviceObject.getPostById(postId);
            return {
                statusCode: 202,
                data: {
                    message: "Found Post",
                    code: "OK",
                    result: result,
                }
            }
        } catch (err) {
            return {
                message: err,
                code: "BAD",
            };
        }
    };
    getPostListController = async (profileId) => {
        try {
            const result = await this.serviceObject.getPostByProfileId(profileId);
            return {
                statusCode: 202,
                data: {
                    message: "Found Post List",
                    code: "OK",
                    result: result,
                }
            }
        } catch (err) {
            return {
                message: err,
                code: "BAD",
            };
        }
    };
    addPostController = async (postData = {}) => {
        try {
            const {hashList, mentionList} = extractSpecialWord(postData.content);
            const result = await this.serviceObject.addPost(postData);
            const resultMention = mentionList.length > 0
                ? await this.processMention(mentionList, result.insertedId, postData.profileId, "post")
                : null;
            const resultHashtag = hashList.length > 0
                ? await this.processHashtag(hashList, result.insertedId, postData.profileId, "post")
                : null;

            return {
                statusCode: 202,
                data: {
                    message: "New Post Inserted",
                    code: "OK",
                    postResult: result,
                    hashtagResult: resultHashtag,
                    mentionResult: resultMention
                }
            }
        } catch (err) {
            return {
                message: err,
                code: "BAD",
            };
        }
    };
    updatePostLikeController = async (postId, profileId) => {
        try {
            const result = await this.serviceObject.updatePostLike({postId, profileId});
            return {
                statusCode: 202,
                data: {
                    message: "Post Like updated",
                    code: "OK",
                    result: result,
                }
            }
        } catch (err) {
            return {
                message: err,
                code: "BAD",
            };
        }
    };
    getRepostController = async (profileId) => {
        try {
            const result = await this.serviceObject.getAllRepost(profileId);
            return {
                statusCode: 202,
                data: {
                    message: result.length > 0 ? "Found all the repost List" : "No repost list",
                    code: "OK",
                    result: result,
                }
            }
        } catch (err) {
            return {
                message: err,
                code: "BAD",
            };
        }
    };
    deletePostController = async (postId) => {
        try {
            const result = await this.serviceObject.deletePost(postId);
            return {
                statusCode: 202,
                data: {
                    message: "Post deleted!",
                    code: "OK",
                    result: result,
                }
            }
        } catch (err) {
            return {
                message: err,
                code: "BAD",
            };
        }
    };
}

module.exports = PostController;