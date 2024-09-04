const extractSpecialWord = require("../util/extractSpecialWord");

class ReplyController {
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

    addReply = async (replyData = {}) => {
        try {
            const result = await this.serviceObject.createReplyService(replyData);
            return this.#createResponse(200, "Comment Inserted Successfully", "OK", result);
        } catch (err) {
            return this.#createResponse(
                err.statusCode || 500,
                err.message || "An error occurred",
                err.code || "ERROR"
            );
        }
    };
    getReply = async (entityId, option = "") => {
        /* Options are -- getByReplyId, getByCommentId & getByProfileId */
        try {
            let result;
            switch (option) {
                case "getByReplyId":
                    result = await this.serviceObject.getByReplyId(entityId);
                    break;
                case "getByCommentId":
                    result = await this.serviceObject.getByCommentId(entityId);
                    break;
                case "getByProfileId":
                    result = await this.serviceObject.getByProfileId(entityId);
                    break;
                default:
                    break;
            }
            return this.#createResponse(200, "Found Replies List", "OK", result);
        } catch (err) {
            return this.#createResponse(
                err.statusCode || 500,
                err.message || "An error occurred",
                err.code || "ERROR"
            );
        }
    };
    updateLikeReply = async (replyData = {}, option = "") => {
        /* Options are -- addLike & removeLike */
        const {replyId, profileId} = replyData;
        const updateData = {
            replyId: replyId,
            profileId: profileId,
        };
        try {
            const result = option === "addLike"
                ? await this.serviceObject.updateReply(updateData, "addLike")
                : await this.serviceObject.updateReply(updateData, "removeLike");
            return this.#createResponse(200, "Reply Update!", "OK", result);
        } catch (err) {
            return this.#createResponse(
                err.statusCode || 500,
                err.message || "An error occurred",
                err.code || "ERROR"
            );
        }
    };
    deleteReply = async (replyId) => {
        try {
            const result = await this.serviceObject.deleteReplyService(replyId);
            return this.#createResponse(200, "Reply Deleted", "OK", result);
        } catch (err) {
            return this.#createResponse(
                err.statusCode || 500,
                err.message || "An error occurred",
                err.code || "ERROR"
            );
        }
    };
}

module.exports = ReplyController;