class CommentController {
    constructor(commentServiceObject) {
        this.commentServiceObject = commentServiceObject;
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
            const result = await this.commentServiceObject.insertComment(commentData);
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
        /* Options are -- getByPostId & getByProfileId */
        try {
            const result = option === "getByPostId"
                ? await this.commentServiceObject.getCommentByPostId(entityId)
                : await this.commentServiceObject.getCommentByProfileId(entityId);
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
                ? await this.commentServiceObject.updateComment(updateData, "addLike")
                : await this.commentServiceObject.updateComment(updateData, "removeLike");
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
            const result = await this.commentServiceObject.deleteComment(commentId);
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