const extractSpecialWord = require("../util/extractSpecialWord");

class CommentService {
    constructor(ISC, modelObject) {
        this.modelObject = modelObject;
        this.ISC = ISC;
    }

    createCommentService = async (commentData) => {
        try {
            const {hashList, mentionList} = extractSpecialWord(commentData.content);
            const {postId, profileId, content} = commentData;
            const newComments = {
                postId: postId,
                profileId: profileId,
                timestamp: new Date().toString(),
                content: content,
                likeIds: [],
            };
            const resultComment = await this.modelObject.add(newComments);
            const resultMention = mentionList.length !== 0
                ? await this.ISC.resolveService('processMention')(mentionList, resultComment.insertedId.toHexString(), commentData.profileId, "addMentionProcess")
                : null;
            const resultHashtag = hashList.length !== 0
                ? await this.ISC.resolveService('processHashtag')(hashList, resultComment.insertedId.toHexString(), commentData.profileId, "addHashtagProcess")
                : null;

            this.ISC.removeServiceAddress('processMention');
            this.ISC.removeServiceAddress('processHashtag');

            return {
                postResult: resultComment,
                hashtagResult: resultHashtag,
                mentionResult: resultMention
            };
        } catch (err) {
            throw new Error(err);
        }
    };
    getByPostId = async (postId) => {
        try {
            return await this.modelObject.findByPostId(postId);
        } catch (err) {
            throw new Error(err);
        }
    };
    getCommentIdListByPostId = async (postId) => {
        try {
            const commentList = await this.getByPostId(postId);
            return commentList.map(comment => comment._id.toHexString());
        } catch (err) {
            throw new Error(err);
        }
    };
    getByProfileId = async (profileId) => {
        try {
            return await this.modelObject.findByProfileId(profileId);
        } catch (err) {
            throw new Error(err);
        }
    };
    getCommentById = async (commentId) => {
        try {
            return await this.modelObject.findByCommentId(commentId);
        } catch (err) {
            throw new Error(err);
        }
    };
    updateCommentLike = async (commentData, options = "") => {
        /* Option are -- addLike & removeLike */
        try {
            const {commentId, profileId} = commentData;
            const updateData = {
                commentId: commentId,
                profileId: profileId,
            };
            return options === "addLike"
                ? this.modelObject.addLike(updateData)
                : this.modelObject.removeLike(updateData);
        } catch (err) {
            throw new Error(err);
        }
    };
    deleteCommentService = async (commentId) => {
        try {
            const getCommentData = await this.getCommentById(commentId);
            if (!getCommentData) throw new Error("Comment not Found");
            const {hashList, mentionList} = extractSpecialWord(getCommentData.content);

            const resultMention = mentionList.length !== 0 ?
                await this.ISC.resolveService('processMention')(mentionList, commentId, getCommentData.profileId, "removeMentionProcess")
                : null;
            const resultHashtag = hashList.length !== 0 ?
                await this.ISC.resolveService('processHashtag')(hashList, commentId, getCommentData.profileId, "removeHashtagProcess")
                : null;
            const resultComment = await this.modelObject.delete(commentId);

            this.ISC.removeServiceAddress('processMention');
            this.ISC.removeServiceAddress('processHashtag');

            return {
                postResult: resultComment,
                hashtagResult: resultHashtag,
                mentionResult: resultMention,
            };
        } catch (err) {
            throw new Error(err);
        }
    };
}

module.exports = CommentService;