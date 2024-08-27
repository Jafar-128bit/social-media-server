module.exports = (controllerObject = {}, validator, middlewareObject = {}) => {
    const express = require('express');
    const router = express.Router();

    const {
        getProfileService,
        updateProfilePictureService,
        updatedProfileInfoService,
        updateFollowingService,
        changePrivateStatusService,
        updateEmailService
    } = require('../service/profileService');

    const {
        getProfileByIdController,
        getProfileListController,
        updateProfilePictureController,
        deleteProfilePictureController,
        updateProfileDescriptionController,
        updateProfileLinksController,
        addFollowingController,
        removeFollowingController,
        changePrivateStatusController,
        updateEmailController
    } = controllerObject;

    const {uploadFileMiddleware} = middlewareObject;

    router.get("/getProfile", async (req, res) => {
        const isValid = validator(req.query, 'idValidator');
        if (isValid) {
            const {profileId} = req.query;

            try {
                const result = await getProfileByIdController({service: getProfileService}, {profileId});
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(500).json(err);
            }

        } else return res.status(404).json({message: "Profile Id is Empty!", code: "BAD"});
    });
    router.get("/getProfileList", async (req, res) => {
        const isValid = validator(req.query, 'searchValidator');
        if (isValid) {
            const {searchTerm} = req.query;

            try {
                const result = await getProfileListController({service: getProfileService}, {searchTerm});
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(500).json(err);
            }

        } else return res.status(404).json({message: "Profile Id is Empty!", code: "BAD"});
    });
    router.patch("/editProfilePicture", uploadFileMiddleware.single('file'), async (req, res) => {
        const isValid = validator(req.body, "idValidator");
        if (isValid) {
            const {profileId} = req.body;
            const filePath = req.file.path;
            try {
                const result = await updateProfilePictureController({service: updateProfilePictureService}, {
                    profileId,
                    filePath
                });
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(500).json(err);
            }

        } else return res.status(404).json({message: "Profile Id is Empty!", code: "BAD"});
    });

    router.patch('/editProfileDescription', async (req, res) => {
        const isIdValidated = validator(req.body, "idValidator");
        const isDescriptionValidated = validator(req.body, "descriptionValidator");

        if (isIdValidated && isDescriptionValidated) {
            const {profileId, profileDescription} = req.body;
            try {
                const result = await updateProfileDescriptionController({service: updatedProfileInfoService}, {
                    profileId,
                    updatedData: profileDescription
                });
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(500).json(err);
            }

        } else return res.status(404).json({message: "Profile Id or Description is Empty!", code: "BAD"});
    });
    router.patch('/editProfileLink', async (req, res) => {
        const isIdValidated = validator(req.body, "idValidator");
        const isLinkValidated = validator(req.body, "linkValidator");

        if (isIdValidated && isLinkValidated) {
            const {profileId, linkList} = req.body;
            try {
                const result = await updateProfileLinksController({service: updatedProfileInfoService}, {
                    profileId,
                    updatedData: linkList,
                });
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(500).json(err);
            }

        } else return res.status(404).json({message: "Profile Id or Link List is Empty!", code: "BAD"});
    });
    router.patch('/addFollowing', async (req, res) => {
        const isValid = validator(req.query, 'followingIdValidator');
        if (isValid) {
            const {profileId, followingProfileId} = req.query;

            try {
                const result = await addFollowingController({service: updateFollowingService}, {
                    profileId,
                    followingProfileId
                });
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(500).json(err);
            }

        } else return res.status(404).json({message: "Profile Id is Empty!", code: "BAD"});
    });
    router.patch('/editPrivate', async (req, res) => {
        const isIdValidated = validator(req.body, "idValidator");
        const isPrivateDataValidated = validator(req.body, "privateValidator");

        if (isIdValidated && isPrivateDataValidated) {
            const {profileId, privateStatus} = req.body;
            try {
                const result = await changePrivateStatusController({service: changePrivateStatusService}, {
                    profileId,
                    privateStatus
                });
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(500).json(err);
            }

        } else return res.status(404).json({message: "Profile Id or status is Empty!", code: "BAD"});
    });
    router.patch('/editEmail', async (req, res) => {
        const isIdValidated = validator(req.body, "idValidator");
        const isEmailDataValidated = validator(req.body, "emailValidator");

        if (isIdValidated && isEmailDataValidated) {
            const {profileId, email} = req.body;
            try {
                const result = await updateEmailController({service: updateEmailService}, {profileId, email});
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(500).json(err);
            }

        } else return res.status(404).json({message: "Profile Id or Email is Empty!", code: "BAD"});
    });

    router.delete('/deleteFollowing', async (req, res) => {
        const isValid = validator(req.query, 'followingIdValidator');
        if (isValid) {
            const {profileId, followingProfileId} = req.query;

            try {
                const result = await removeFollowingController({service: updateFollowingService}, {
                    profileId,
                    followingProfileId
                });
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(500).json(err);
            }

        } else return res.status(404).json({message: "Profile Id is Empty!", code: "BAD"});
    });
    router.delete('/deleteProfilePicture', async (req, res) => {
        const isValid = validator(req.body, "idValidator");
        if (isValid) {
            const {profileId} = req.body;
            try {
                const result = await deleteProfilePictureController({service: updateProfilePictureService}, {profileId});
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(500).json(err);
            }

        } else return res.status(404).json({message: "Profile Id is Empty!", code: "BAD"});
    });

    return router;
}