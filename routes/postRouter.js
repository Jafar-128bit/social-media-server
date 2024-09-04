module.exports = (controllerObject, validator, middlewareObject = {}) => {
    const express = require('express');
    const router = express.Router();

    router.get('/getPost', async (req, res) => {
        const postIdValid = validator(req.body, "postIdValidator");
        if (postIdValid) {
            const {postId} = req.body;
            try {
                const result = await controllerObject.getPostController(postId);
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(404).json(err);
            }
        } else return res.status(404).json({message: "Post Id is empty!", code: "BAD"});
    });
    router.get('/getPostList', async (req, res) => {
        const profileIdValid = validator(req.body, "profileIdValidator");
        if (profileIdValid) {
            const {profileId} = req.body;
            try {
                const result = await controllerObject.getPostListController(profileId);
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(404).json(err);
            }
        } else return res.status(404).json({message: "Profile Id is empty!", code: "BAD"});
    });
    router.get('/getRepostList', async (req, res) => {
        const profileIdValid = validator(req.body, "profileIdValidator");
        if (profileIdValid) {
            const {profileId} = req.body;
            try {
                const result = await controllerObject.getRepostController(profileId);
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(404).json(err);
            }
        } else return res.status(404).json({message: "Profile Id is empty!", code: "BAD"});
    });
    router.post('/addPost', middlewareObject.serviceRegistrationAddEntity, async (req, res) => {
        const postDataValid = validator(req.body, "postDataValidator");
        if (postDataValid) {
            const {profileId, content, isRepost, originalPostId, attachments} = req.body;
            try {
                const result = await controllerObject.addPostController({
                    profileId,
                    content,
                    isRepost,
                    originalPostId,
                    attachments
                });
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(404).json(err);
            }
        } else return res.status(404).json({
            message: "Post data is empty or missing some value",
            code: "BAD"
        });
    });
    router.patch('/editPostLike', async (req, res) => {
        const postIdValid = validator(req.body, "postIdValidator");
        const profileIdValid = validator(req.body, "profileIdValidator");

        if (profileIdValid && postIdValid) {
            const {postId, profileId} = req.body;
            try {
                const result = await controllerObject.updatePostLikeController(postId, profileId);
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(404).json(err);
            }
        } else return res.status(404).json({message: "Profile Id or Post Id are empty!", code: "BAD"});
    });
    router.delete('/deletePost', middlewareObject.serviceRegistrationRemoveEntity, async (req, res) => {
        const postIdValid = validator(req.body, "postIdValidator");
        if (postIdValid) {
            const {postId} = req.body;
            try {
                const result = await controllerObject.deletePostController(postId);
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(404).json(err);
            }
        } else return res.status(404).json({message: "Post Id is empty!", code: "BAD"});
    });

    return router;
};