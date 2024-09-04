module.exports = (controllerObject = {}, validator, middlewareObject = {}) => {
    const express = require('express');
    const router = express.Router();

    router.get("/getProfile", middlewareObject.authMiddleware,async (req, res) => {
        const isValid = validator(req.query, 'idValidator');
        if (isValid) {
            const {profileId} = req.query;

            try {
                const result = await controllerObject.getProfileByIdController({profileId});
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(500).json(err);
            }

        } else return res.status(404).json({message: "Profile Id is Empty!", code: "BAD"});
    });
    router.get("/getProfileList", middlewareObject.authMiddleware,async (req, res) => {
        const isValid = validator(req.query, 'searchValidator');
        if (isValid) {
            const {searchTerm} = req.query;

            try {
                const result = await controllerObject.getProfileListController({searchTerm});
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(500).json(err);
            }

        } else return res.status(404).json({message: "Profile Id is Empty!", code: "BAD"});
    });

    router.patch("/editProfilePicture", middlewareObject.authMiddleware,middlewareObject.fileProcess.single('file'), async (req, res) => {
        const isValid = validator(req.body, "idValidator");
        if (isValid) {
            const {profileId} = req.body;
            const filePath = req.file.path;
            try {
                const result = await controllerObject.updateProfilePictureController({profileId, filePath});
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(500).json(err);
            }

        } else return res.status(404).json({message: "Profile Id is Empty!", code: "BAD"});
    });
    router.patch('/editProfileDescription', middlewareObject.authMiddleware,async (req, res) => {
        const isIdValidated = validator(req.body, "idValidator");
        const isDescriptionValidated = validator(req.body, "descriptionValidator");

        if (isIdValidated && isDescriptionValidated) {
            const {profileId, profileDescription} = req.body;
            try {
                const result = await controllerObject.updateProfileDescriptionController({
                    profileId,
                    updatedData: profileDescription
                });
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(500).json(err);
            }

        } else return res.status(404).json({message: "Profile Id or Description is Empty!", code: "BAD"});
    });
    router.patch('/editProfileLink', middlewareObject.authMiddleware,async (req, res) => {
        const isIdValidated = validator(req.body, "idValidator");
        const isLinkValidated = validator(req.body, "linkValidator");

        if (isIdValidated && isLinkValidated) {
            const {profileId, linkList} = req.body;
            try {
                const result = await controllerObject.updateProfileLinksController({profileId, updatedData: linkList,});
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(500).json(err);
            }

        } else return res.status(404).json({message: "Profile Id or Link List is Empty!", code: "BAD"});
    });
    router.patch('/addFollowing', middlewareObject.authMiddleware,async (req, res) => {
        const isValid = validator(req.query, 'followingIdValidator');
        if (isValid) {
            const {profileId, followingProfileId} = req.query;

            try {
                const result = await controllerObject.addFollowingController({profileId, followingProfileId});
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(500).json(err);
            }

        } else return res.status(404).json({message: "Profile Id is Empty!", code: "BAD"});
    });
    router.patch('/editPrivate', middlewareObject.authMiddleware,async (req, res) => {
        const isIdValidated = validator(req.body, "idValidator");
        const isPrivateDataValidated = validator(req.body, "privateValidator");

        if (isIdValidated && isPrivateDataValidated) {
            const {profileId, privateStatus} = req.body;
            try {
                const result = await controllerObject.changePrivateStatusController({profileId, privateStatus});
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(500).json(err);
            }

        } else return res.status(404).json({message: "Profile Id or status is Empty!", code: "BAD"});
    });
    router.patch('/editEmail', middlewareObject.authMiddleware,async (req, res) => {
        const isIdValidated = validator(req.body, "idValidator");
        const isEmailDataValidated = validator(req.body, "emailValidator");

        if (isIdValidated && isEmailDataValidated) {
            const {profileId, email} = req.body;
            try {
                const result = await controllerObject.updateEmailController({profileId, email});
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(500).json(err);
            }

        } else return res.status(404).json({message: "Profile Id or Email is Empty!", code: "BAD"});
    });

    router.delete('/deleteFollowing', middlewareObject.authMiddleware,async (req, res) => {
        const isValid = validator(req.query, 'followingIdValidator');
        if (isValid) {
            const {profileId, followingProfileId} = req.query;

            try {
                const result = await controllerObject.removeFollowingController({profileId, followingProfileId});
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(500).json(err);
            }

        } else return res.status(404).json({message: "Profile Id is Empty!", code: "BAD"});
    });
    router.delete('/deleteProfilePicture', middlewareObject.authMiddleware,async (req, res) => {
        const isValid = validator(req.body, "idValidator");
        if (isValid) {
            const {profileId} = req.body;
            try {
                const result = await controllerObject.deleteProfilePictureController({profileId});
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(500).json(err);
            }

        } else return res.status(404).json({message: "Profile Id is Empty!", code: "BAD"});
    });

    return router;
}