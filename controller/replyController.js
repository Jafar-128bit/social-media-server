class ReplyController {
    constructor(replyServiceObject) {
        this.replyServiceObject = replyServiceObject;
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
            const result = await this.replyServiceObject.insertReply(replyData);
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
        /* Options are -- getByCommentId & getByProfileId */
        try {
            const result = option === "getByCommentId"
                ? await this.replyServiceObject.getReplyByCommentId(entityId)
                : await this.replyServiceObject.getReplyByProfileId(entityId);
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
                ? await this.replyServiceObject.updateReply(updateData, "addLike")
                : await this.replyServiceObject.updateReply(updateData, "removeLike");
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
            const result = await this.replyServiceObject.deleteComment(replyId);
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