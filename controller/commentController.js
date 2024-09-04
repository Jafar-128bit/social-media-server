const extractSpecialWord = require('../util/extractSpecialWord');

class CommentController {
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

    addComment = async (commentData = {}) => {
        try {
            const result = await this.serviceObject.createCommentService(commentData);
            return this.#createResponse(200, "Comment Inserted Successfully", "OK", result);
        } catch (err) {
            return this.#createResponse(
                err.statusCode || 500,
                err.message || "An error occurred",
                err.code || "ERROR"
            );
        }
    };
    getComment = async (entityId, option = "") => {
        /* Options are -- getByCommentId, getByPostId & getByProfileId */
        try {
            let result;
            switch (option) {
                case "getByCommentId":
                    result = await this.serviceObject.getCommentById(entityId);
                    break;
                case "getByPostId":
                    result = await this.serviceObject.getByPostId(entityId);
                    break;
                case "getByReplyId":
                    result = await this.serviceObject.getByProfileId(entityId);
                    break;
                default:
                    break;
            }
            return this.#createResponse(200, "Found Comment List", "OK", result);
        } catch (err) {
            return this.#createResponse(
                err.statusCode || 500,
                err.message || "An error occurred",
                err.code || "ERROR"
            );
        }
    };
    updateLikeComment = async (commentData = {}, option = "") => {
        /* Options are -- addLike & removeLike */
        const {commentId, profileId} = commentData;
        const updateData = {
            commentId: commentId,
            profileId: profileId,
        };
        try {
            const result = option === "addLike"
                ? await this.serviceObject.updateCommentLike(updateData, "addLike")
                : await this.serviceObject.updateCommentLike(updateData, "removeLike");
            return this.#createResponse(200, "Comment Update!", "OK", result);
        } catch (err) {
            return this.#createResponse(
                err.statusCode || 500,
                err.message || "An error occurred",
                err.code || "ERROR"
            );
        }
    };
    deleteComment = async (commentId) => {
        try {
            const result = await this.serviceObject.deleteCommentService(commentId);
            return this.#createResponse(200, "Comment Deleted", "OK", result);
        } catch (err) {
            return this.#createResponse(
                err.statusCode || 500,
                err.message || "An error occurred",
                err.code || "ERROR"
            );
        }
    };
}

module.exports = CommentController;