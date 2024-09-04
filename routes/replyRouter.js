module.exports = (controllerObject = {}, validator, middlewareObject = {}) => {
    const express = require('express');
    const router = express.Router();

    router.get('/getForComment', async (req, res) => {
        const isValid = validator(req.body, "commentId");
        if (isValid) {
            try {
                const {commentId} = req.body;
                const result = await controllerObject.getReply(commentId, "getByCommentId");
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(404).json(err);
            }
        } else return res.status(404).json({message: "Comment Id is empty!", code: "BAD"});
    });
    router.get('/getForProfile', async (req, res) => {
        const isValid = validator(req.body, "profileId");
        if (isValid) {
            try {
                const {profileId} = req.body;
                const result = await controllerObject.getReply(profileId, "getByProfileId");
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(404).json(err);
            }
        } else return res.status(404).json({message: "Profile Id is empty!", code: "BAD"});
    });
    router.post('/add', middlewareObject.serviceRegistrationAddEntity, async (req, res) => {
        const isValidComment = validator(req.body, "commentId");
        const isValidProfile = validator(req.body, "profileId");
        const isValidContent = validator(req.body, "content");
        if (isValidComment && isValidProfile && isValidContent) {
            try {
                const {commentId, profileId, content} = req.body;
                const result = await controllerObject.addReply({commentId, profileId, content});
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(404).json(err);
            }
        } else return res.status(404).json({message: "Comment Data is empty!", code: "BAD"});
    });
    router.patch('/editLike/:option', async (req, res) => {
        const isValidReply = validator(req.body, "replyId");
        const isValidProfile = validator(req.body, "profileId");
        const isValidOption = validator(req.params, "editOption");
        if (isValidReply && isValidProfile && isValidOption) {
            try {
                const {replyId, profileId} = req.body;
                const {option} = req.params;
                const result = await controllerObject.updateLikeReply({replyId, profileId}, option);
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(404).json(err);
            }
        } else return res.status(404).json({message: "Reply Id or Profile Id is empty!", code: "BAD"});
    });
    router.delete('/delete', middlewareObject.serviceRegistrationRemoveEntity, async (req, res) => {
        const isValid = validator(req.body, "replyId");
        if (isValid) {
            try {
                const {replyId} = req.body;
                const result = await controllerObject.deleteReply(replyId);
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(404).json(err);
            }
        } else return res.status(404).json({message: "Reply Id is empty!", code: "BAD"});
    });

    return router;
}