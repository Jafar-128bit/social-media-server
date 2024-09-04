const extractSpecialWord = require("../util/extractSpecialWord");

class PostService {
    constructor(ISC, modelObject) {
        this.modelObject = modelObject;
        this.ISC = ISC;
    }

    createPostService = async (postData = {}) => {
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
    getPostById = async (postId, session = null) => await this.modelObject.findPostById(postId, {session});
    getPostByProfileId = async (profileId, session = null) => await this.modelObject.findByProfileId(profileId, {session});
    getAllRepost = async (profileId, session = null) => await this.modelObject.findRepostsByProfileId(profileId, {session});
    updatePostLike = async ({postId, profileId}, option = "", session = null) => {
        return option === "addLike"
            ? await this.modelObject.addLike({postId, profileId}, {session})
            : await this.modelObject.removeLike({postId, profileId}, {session});
    };
    deletePostService = async (postId) => {
        try {
            const getPostData = await this.getPostById(postId);
            if (!getPostData) throw new Error("Post not found");

            const commentIdList = await this.ISC.resolveService('getCommentIdList')(postId);

            const {hashList, mentionList} = extractSpecialWord(getPostData.content);

            const resultMention = mentionList.length !== 0
                ? await this.ISC.resolveService('processMention')(mentionList, postId, getPostData.profileId, "removeMentionProcess")
                : null;
            console.log(resultMention);
            const resultHashtag = hashList.length !== 0
                ? await this.ISC.resolveService('processHashtag')(hashList, postId, getPostData.profileId, "removeHashtagProcess")
                : null;
            const resultPost = await this.modelObject.delete(postId);

            this.ISC.removeServiceAddress('processMention');
            this.ISC.removeServiceAddress('processHashtag');
            this.ISC.removeServiceAddress('getCommentIdList');

            return {
                postResult: resultPost,
                hashtagResult: resultHashtag,
                mentionResult: resultMention,
            };
        } catch (err) {
            throw new Error(err);
        }
    };
}

module.exports = PostService;
