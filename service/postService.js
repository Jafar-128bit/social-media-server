class PostService {
    constructor(modelObject) {
        this.modelObject = modelObject;
    }

    getPostById = async (postId) => await this.modelObject.findPostById(postId);
    getPostByProfileId = async (profileId) => await this.modelObject.findPostByProfileId(profileId);
    addPost = async (post = {}) => {
        const todayDateTime = new Date();

        const newPost = {
            profileId: post.profileId,
            timestamp: todayDateTime.toString(),
            content: post.content,
            likeIds: [],
            isRepost: post.isRepost,
            originalPostId: post.originalPostId !== undefined && post.originalPostId.length > 0
                ? post.originalPostId
                : null,
            attachments: post.attachments.length > 0 ? post.attachments : [],
        };
        try {
            return await this.modelObject.insertPost(newPost);
        } catch (err) {
            throw new Error(err);
        }
    };
    updatePostLike = async ({postId, profileId}) => await this.modelObject.updatePostLikeById(postId, profileId);
    getAllRepost = async (profileId) => await this.modelObject.findReposts(profileId);
    deletePost = async (postId) => {
        return await this.modelObject.deletePostById(postId);
    }
}

module.exports = PostService;
