class CommentService {
    constructor(commentModelObject) {
        this.commentModelObject = commentModelObject;
    }

    insertComment = async (commentData = {}) => {
        try {
            const {postId, profileId, content} = commentData;
            const newComments = {
                postId: postId,
                profileId: profileId,
                timestamp: new Date().toString(),
                content: content,
                likeIds: [],
            }
            return await this.commentModelObject.add(newComments);
        } catch (err) {
            throw new Error(err);
        }
    };
    getCommentByPostId = async (postId) => {
        try {
            return await this.commentModelObject.findByPostId(postId);
        } catch (err) {
            throw new Error(err);
        }
    };
    getCommentByProfileId = async (profileId) => {
        try {
            return await this.commentModelObject.findByProfileId(profileId);
        } catch (err) {
            throw new Error(err);
        }
    };
    updateComment = async (commentData = {}, options = "") => {
        /* Option are -- addLike & removeLike */
        try {
            const {commentId, profileId} = commentData;
            const updateData = {
                commentId: commentId,
                profileId: profileId,
            };
            return options === "addLike"
                ? this.commentModelObject.addLikeById(updateData)
                : this.commentModelObject.removeLikeById(updateData);
        } catch (err) {
            throw new Error(err);
        }
    };
    deleteComment = async (commentId) => {
        try {
            return await this.commentModelObject.deleteById(commentId);
        } catch (err) {
            throw new Error(err);
        }
    };
}

module.exports = CommentService;