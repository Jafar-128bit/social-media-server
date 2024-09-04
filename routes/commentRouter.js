module.exports = (controllerObject = {}, validator, middlewareObject = {}) => {
    const express = require('express');
    const router = express.Router();

    router.get('/getForPost', async (req, res) => {
        const isValid = validator(req.body, "postId");
        if (isValid) {
            try {
                const {postId} = req.body;
                const result = await controllerObject.getCommentController(postId, "getByPostId");
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(404).json(err);
            }
        } else return res.status(404).json({message: "Post Id is empty!", code: "BAD"});
    });
    router.get('/getForProfile', async (req, res) => {
        const isValid = validator(req.body, "profileId");
        if (isValid) {
            try {
                const {profileId} = req.body;
                const result = await controllerObject.getCommentController(profileId, "getByProfileId");
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(404).json(err);
            }
        } else return res.status(404).json({message: "Profile Id is empty!", code: "BAD"});
    });
    router.post('/add', middlewareObject.serviceRegistrationAddEntity,async (req, res) => {
        const isValidPost = validator(req.body, "postId");
        const isValidProfile = validator(req.body, "profileId");
        const isValidContent = validator(req.body, "content");
        if (isValidPost && isValidProfile && isValidContent) {
            try {
                const {postId, profileId, content} = req.body;
                const result = await controllerObject.addCommentController({postId, profileId, content});
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(404).json(err);
            }
        } else return res.status(404).json({message: "Comment Data is empty!", code: "BAD"});
    });
    router.patch('/editLike/:option', async (req, res) => {
        const isValidComment = validator(req.body, "commentId");
        const isValidProfile = validator(req.body, "profileId");
        const isValidOption = validator(req.params, "editOption");
        if (isValidComment && isValidProfile && isValidOption) {
            try {
                const {commentId, profileId} = req.body;
                const {option} = req.params;
                const result = await controllerObject.updateLikeCommentController({commentId, profileId}, option);
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(404).json(err);
            }
        } else return res.status(404).json({message: "Comment Id or Profile Id is empty!", code: "BAD"});
    });
    router.delete('/delete', middlewareObject.serviceRegistrationRemoveEntity,async (req, res) => {
        const isValid = validator(req.body, "commentId");
        if (isValid) {
            try {
                const {commentId} = req.body;
                const result = await controllerObject.deleteCommentController(commentId);
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(404).json(err);
            }
        } else return res.status(404).json({message: "Comment Id is empty!", code: "BAD"});
    });

    return router;
}