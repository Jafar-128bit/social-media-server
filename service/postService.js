const extractSpecialWord = require("../util/extractSpecialWord");

class PostService {
    constructor(ISC, modelObject, messageQueue) {
        this.modelObject = modelObject;
        this.ISC = ISC;
        this.messageQueue = messageQueue;
    }

    createPostService = async (postData) => {
        try {
            const {hashList, mentionList} = extractSpecialWord(postData.content);
            const todayDateTime = new Date();
            const newPost = {
                profileId: postData.profileId,
                timestamp: todayDateTime.toString(),
                content: postData.content,
                likeIds: [],
                isRepost: postData.isRepost,
                originalPostId: postData.originalPostId !== undefined && postData.originalPostId.length > 0
                    ? postData.originalPostId
                    : null,
                attachments: postData.attachments.length > 0 ? postData.attachments : [],
            };
            const resultPost = await this.modelObject.add(newPost);
            const resultMention = mentionList.length !== 0
                ? await this.ISC.resolveService('processMention')(mentionList, resultPost.insertedId.toHexString(), postData.profileId, "addMentionProcess")
                : null;
            const resultHashtag = hashList.length !== 0
                ? await this.ISC.resolveService('processHashtag')(hashList, resultPost.insertedId.toHexString(), postData.profileId, "addHashtagProcess")
                : null;

            this.ISC.removeServiceAddress('processMention');
            this.ISC.removeServiceAddress('processHashtag');
            this.ISC.removeServiceAddress('getByUsername');

            return {
                postResult: resultPost,
                hashtagResult: resultHashtag,
                mentionResult: resultMention
            };
        } catch (err) {
            throw new Error(err);
        }
        ;
    };
    getPostById = async (postId) => {
        try {
            return await this.modelObject.findPostById(postId);
        } catch (err) {
            throw new Error(err);
        }
    };
    getPostByProfileId = async (profileId) => {
        try {
            return await this.modelObject.findByProfileId(profileId);
        } catch (err) {
            throw new Error(err);
        }
    };
    getAllRepost = async (profileId) => {
        try {
            return await this.modelObject.findRepostsByProfileId(profileId);
        } catch (err) {
            throw new Error(err);
        }
    };
    updatePostLike = async ({postId, profileId}, option = "") => {
        return option === "addLike"
            ? await this.modelObject.addLike({postId, profileId})
            : await this.modelObject.removeLike({postId, profileId});
    };
    deletePostService = async (postId) => {
        try {
            console.log("Post Delete Working")
            const getPostData = await this.getPostById(postId);
            if (!getPostData) throw new Error("Post not found");

            const {hashList, mentionList} = extractSpecialWord(getPostData.content);
            const resultMention = mentionList.length !== 0
                ? await this.ISC.resolveService('processMention')(mentionList, postId, getPostData.profileId, "removeMentionProcess")
                : null;
            console.log(resultMention);
            const resultHashtag = hashList.length !== 0
                ? await this.ISC.resolveService('processHashtag')(hashList, postId, getPostData.profileId, "removeHashtagProcess")
                : null;
            const resultPost = await this.modelObject.delete(postId);

            return {
                postResult: resultPost,
                hashtagResult: resultHashtag,
                mentionResult: resultMention,
            };
        } catch (err) {
            throw new Error(err);
        }
    };
    postDeleteWorker = async (postId) => {
        try {
            const commentIdList = await this.ISC.resolveService('getCommentIdList')(postId);
            if (commentIdList.length === 0) return await this.deletePostService(postId);

            /* First Queue with the lowest priority */
            const postDeleteQueueObject = {
                serviceCallback: this.deletePostService,
                serviceParameters: [postId],
                priority: 2,
            };
            this.messageQueue.enqueue(postDeleteQueueObject);

            /* Second Queue with the medium priority */
            const commentDeleteQueueObject = {
                serviceCallback: this.ISC.resolveService('deleteCommentService'),
                serviceParameters: [...commentIdList],
                priority: 1,
            };
            this.messageQueue.enqueue(commentDeleteQueueObject);

            /* Last Queue with the highest priority */
            let replyIdList = [];
            for (const commentId of commentIdList) {
                const result = await this.ISC.resolveService('getReplyIdList')(commentId);
                if (Array.isArray(result)) replyIdList.push(...result);
                else replyIdList.push(result);
            }
            const replyDeleteQueueObject = {
                serviceCallback: this.ISC.resolveService('deleteReplyService'),
                serviceParameters: [...replyIdList],
                priority: 0,
            };
            this.messageQueue.enqueue(replyDeleteQueueObject);

            return "Delete Queue Initiated!";
        } catch (err) {
            throw new Error(err);
        }
    };
}

module.exports = PostService;
