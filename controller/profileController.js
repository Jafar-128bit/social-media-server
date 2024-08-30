class ProfileController {
    constructor(serviceObject) {
        this.serviceObject = serviceObject;
    }

    getProfileByIdController = async ({profileId}) => {
        try {
            const result = await this.serviceObject.getProfileService("getById", profileId);
            return {
                statusCode: 202,
                data: {
                    message: "Found User",
                    code: "OK",
                    result: result,
                }
            }
        } catch (err) {
            return {
                message: err,
                code: "BAD",
            };
        }
    };
    getProfileListController = async ({searchTerm}) => {
        try {
            const result = await this.serviceObject.getProfileService("getList", searchTerm);
            return {
                statusCode: 202,
                data: {
                    message: "Found Users",
                    code: "OK",
                    result: result,
                }
            }
        } catch (err) {
            return {
                message: err,
                code: "BAD",
            };
        }
    };
    updateProfilePictureController = async ({profileId, filePath}) => {
        try {
            const result = await this.serviceObject.updateProfilePictureService({profileId, filePath}, "addNewPicture");
            return {
                statusCode: 202,
                data: {
                    code: "OK",
                    result: result,
                }
            }
        } catch (err) {
            return {
                message: err,
                code: "BAD",
            };
        }
    };
    deleteProfilePictureController = async ({profileId}) => {
        try {
            const result = await this.serviceObject.updateProfilePictureService({profileId}, "deletePicture");
            return {
                statusCode: 202,
                data: {
                    code: "OK",
                    result: result,
                }
            }
        } catch (err) {
            return {
                message: err,
                code: "BAD",
            };
        }
    };
    updateProfileDescriptionController = async ({profileId, updatedData}) => {
        try {
            const result = await this.serviceObject.updatedProfileInfoService({
                profileId,
                updatedData
            }, "updateDescription");
            return {
                statusCode: 202,
                data: {
                    code: "OK",
                    result: result,
                }
            }
        } catch (err) {
            return {
                message: err,
                code: "BAD",
            };
        }
    };
    updateProfileLinksController = async ({profileId, updatedData}) => {
        try {
            const result = await this.serviceObject.updatedProfileInfoService({profileId, updatedData}, "updateLinks");
            return {
                statusCode: 202,
                data: {
                    code: "OK",
                    result: result,
                }
            }
        } catch (err) {
            return {
                message: err,
                code: "BAD",
            };
        }
    };
    addFollowingController = async ({profileId, followingProfileId}) => {
        try {
            const result = await this.serviceObject.updateFollowingService({
                profileId,
                followingProfileId
            }, "addFollower");
            return {
                statusCode: 202,
                data: {
                    code: "OK",
                    result: result,
                }
            }
        } catch (err) {
            return {
                message: err,
                code: "BAD",
            };
        }
    };
    removeFollowingController = async ({profileId, followingProfileId}) => {
        try {
            const result = await this.serviceObject.updateFollowingService({
                profileId,
                followingProfileId
            }, "removeFollower");
            return {
                statusCode: 202,
                data: {
                    code: "OK",
                    result: result,
                }
            }
        } catch (err) {
            return {
                message: err,
                code: "BAD",
            };
        }
    };
    changePrivateStatusController = async ({profileId, privateStatus}) => {
        try {
            const result = await this.serviceObject.changePrivateStatusService({profileId, privateStatus});
            return {
                statusCode: 202,
                data: {
                    code: "OK",
                    result: result,
                }
            }
        } catch (err) {
            return {
                message: err,
                code: "BAD",
            };
        }
    };
    updateEmailController = async ({profileId, email}) => {
        try {
            const result = await this.serviceObject.updateEmailService({profileId, email});
            return {
                statusCode: 202,
                data: {
                    code: "OK",
                    result: result,
                }
            }
        } catch (err) {
            return {
                message: err,
                code: "BAD",
            };
        }
    };
}

module.exports = ProfileController;