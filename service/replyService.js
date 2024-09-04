const extractSpecialWord = require("../util/extractSpecialWord");

class ReplyService {
    constructor(ISC, modelObject, messageQueue) {
        this.modelObject = modelObject;
        this.ISC = ISC;
        this.messageQueue = messageQueue;
    }

    createReplyService = async (replyData = {}) => {
        try {
            const {commentId, profileId, content} = replyData;
            const newReply = {
                commentId: commentId,
                profileId: profileId,
                timestamp: new Date().toString(),
                content: content,
                likeIds: [],
            };
            const {hashList, mentionList} = extractSpecialWord(replyData.content);
            const resultReply = await this.modelObject.add(newReply);
            const resultMention = mentionList.length > 0
                ? await this.ISC.resolveService('processMention')(mentionList, resultReply.insertedId.toHexString(), replyData.profileId, "addMentionProcess")
                : null;
            const resultHashtag = hashList.length > 0
                ? await this.ISC.resolveService('processHashtag')(hashList, resultReply.insertedId.toHexString(), replyData.profileId, "addHashtagProcess")
                : null;

            this.ISC.removeServiceAddress('processMention');
            this.ISC.removeServiceAddress('processHashtag');
            this.ISC.removeServiceAddress('getByUsername');

            return {
                postResult: resultReply,
                hashtagResult: resultHashtag,
                mentionResult: resultMention
            };
        } catch (err) {
            throw new Error(err);
        }
    };
    getByCommentId = async (commentId) => {
        try {
            return await this.modelObject.findByCommentId(commentId);
            ;
        } catch (err) {
            throw new Error(err);
        }
    };
    getReplyIdListByCommentId = async (commentId) => {
        try {
            const replyList = await this.getByCommentId(commentId);
            return replyList.map(reply => reply._id.toHexString());
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
    getByReplyId = async (replyId) => {
        try {
            return await this.modelObject.findByReplyId(replyId);
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
                ? this.modelObject.addLike(updateData)
                : this.modelObject.removeLike(updateData);
        } catch (err) {
            throw new Error(err);
        }
    };
    deleteReplyService = async (replyId) => {
        try {
            const getReplyData = await this.getByReplyId(replyId);
            if (!getReplyData) throw new Error("Reply not Found");

            const {hashList, mentionList} = extractSpecialWord(getReplyData.content);
            const resultMention = mentionList.length !== 0 ?
                await this.ISC.resolveService('processMention')(mentionList, replyId, getReplyData.profileId, "removeMentionProcess")
                : null;
            const resultHashtag = hashList.length !== 0 ?
                await this.ISC.resolveService('processHashtag')(hashList, replyId, getReplyData.profileId, "removeHashtagProcess")
                : null;
            const resultReply = await this.modelObject.delete(replyId);
            return {
                postResult: resultReply,
                hashtagResult: resultHashtag,
                mentionResult: resultMention
            };
        } catch (err) {
            console.log(err)
            throw new Error(err);
        }
    };
    clearReplyICSNetwork = async () => {
        this.ISC.removeServiceAddress('processMention');
        this.ISC.removeServiceAddress('processHashtag');
        this.ISC.removeServiceAddress('getByUsername');
    };
}

module.exports = ReplyService;