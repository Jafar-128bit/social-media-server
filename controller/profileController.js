class ProfileController {
    constructor(serviceObject) {
        this.serviceObject = serviceObject;
    }

    #createResponse = (statusCode, message, code, result = null) => {
        return {
            statusCode,
            data: {
                message,
                code,
                result,
            }
        };
    };

    getProfileByIdController = async ({profileId}) => {
        try {
            const result = await this.serviceObject.getProfileService("getById", profileId);
            return this.#createResponse(200, "Found User", "OK", result);
        } catch (err) {
            return this.#createResponse(
                err.statusCode || 500,
                err.message || "An error occurred",
                err.code || "ERROR"
            );
        }
    };
    getProfileListController = async ({searchTerm}) => {
        try {
            const result = await this.serviceObject.getProfileService("getList", searchTerm);
            return this.#createResponse(200, "Found Users", "OK", result);
        } catch (err) {
            return this.#createResponse(
                err.statusCode || 500,
                err.message || "An error occurred",
                err.code || "ERROR"
            );
        }
    };
    updateProfilePictureController = async ({profileId, filePath}) => {
        try {
            const result = await this.serviceObject.updateProfilePictureService({profileId, filePath}, "addNewPicture");
            return this.#createResponse(200, "Profile Updated!", "OK", result);
        } catch (err) {
            return this.#createResponse(
                err.statusCode || 500,
                err.message || "An error occurred",
                err.code || "ERROR"
            );
        }
    };
    deleteProfilePictureController = async ({profileId}) => {
        try {
            const result = await this.serviceObject.updateProfilePictureService({profileId}, "deletePicture");
            return this.#createResponse(200, "Profile Deleted!", "OK", result);
        } catch (err) {
            return this.#createResponse(
                err.statusCode || 500,
                err.message || "An error occurred",
                err.code || "ERROR"
            );
        }
    };
    updateProfileDescriptionController = async ({profileId, updatedData}) => {
        try {
            const result = await this.serviceObject.updatedProfileInfoService({
                profileId,
                updatedData
            }, "updateDescription");
            return this.#createResponse(200, "Profile Description Updated!", "OK", result);
        } catch (err) {
            return this.#createResponse(
                err.statusCode || 500,
                err.message || "An error occurred",
                err.code || "ERROR"
            );
        }
    };
    updateProfileLinksController = async ({profileId, updatedData}) => {
        try {
            const result = await this.serviceObject.updatedProfileInfoService({profileId, updatedData}, "updateLinks");
            return this.#createResponse(200, "Profile Link Updated!", "OK", result);
        } catch (err) {
            return this.#createResponse(
                err.statusCode || 500,
                err.message || "An error occurred",
                err.code || "ERROR"
            );
        }
    };
    addFollowingController = async ({profileId, followingProfileId}) => {
        try {
            const result = await this.serviceObject.updateFollowingService({
                profileId,
                followingProfileId
            }, "addFollower");
            return this.#createResponse(200, "Profile Following Updated!", "OK", result);
        } catch (err) {
            return this.#createResponse(
                err.statusCode || 500,
                err.message || "An error occurred",
                err.code || "ERROR"
            );
        }
    };
    removeFollowingController = async ({profileId, followingProfileId}) => {
        try {
            const result = await this.serviceObject.updateFollowingService({
                profileId,
                followingProfileId
            }, "removeFollower");
            return this.#createResponse(200, "Profile Following Updated!", "OK", result);
        } catch (err) {
            return this.#createResponse(
                err.statusCode || 500,
                err.message || "An error occurred",
                err.code || "ERROR"
            );
        }
    };
    changePrivateStatusController = async ({profileId, privateStatus}) => {
        try {
            const result = await this.serviceObject.changePrivateStatusService({profileId, privateStatus});
            return this.#createResponse(200, "Profile Status Changed!", "OK", result);
        } catch (err) {
            return this.#createResponse(
                err.statusCode || 500,
                err.message || "An error occurred",
                err.code || "ERROR"
            );
        }
    };
    updateEmailController = async ({profileId, email}) => {
        try {
            const result = await this.serviceObject.updateEmailService({profileId, email});
            return this.#createResponse(200, "Profile Email Updated!", "OK", result);
        } catch (err) {
            return this.#createResponse(
                err.statusCode || 500,
                err.message || "An error occurred",
                err.code || "ERROR"
            );
        }
    };
}

module.exports = ProfileController;