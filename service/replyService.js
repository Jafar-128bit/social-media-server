class ReplyService {
    constructor(replyModelObject) {
        this.replyModelObject = replyModelObject;
    }

    insertReply = async (replyData = {}) => {
        try {
            const {commentId, profileId, content} = replyData;
            const newComments = {
                commentId: commentId,
                profileId: profileId,
                timestamp: new Date().toString(),
                content: content,
                likeIds: [],
            }
            return await this.replyModelObject.add(newComments);
        } catch (err) {
            throw new Error(err);
        }
    };
    getReplyByCommentId = async (commentId) => {
        try {
            return await this.replyModelObject.findByCommentId(commentId);
        } catch (err) {
            throw new Error(err);
        }
    };
    getReplyByProfileId = async (profileId) => {
        try {
            return await this.replyModelObject.findByProfileId(profileId);
        } catch (err) {
            throw new Error(err);
        }
    };
    updateReply = async (replyData = {}, options = "") => {
        /* Option are -- addLike & removeLike */
        try {
            const {replyId, profileId} = replyData;
            const updateData = {
                replyId: replyId,
                profileId: profileId,
            };
            return options === "addLike"
                ? this.replyModelObject.addLikeById(updateData)
                : this.replyModelObject.removeLikeById(updateData);
        } catch (err) {
            throw new Error(err);
        }
    };
    deleteReply = async (replyId) => {
        try {
            return await this.replyModelObject.deleteById(replyId);
        } catch (err) {
            throw new Error(err);
        }
    };
}

module.exports = ReplyService;