exports.getProfileByIdController = async ({service}, {profileId}) => {
    if (service === undefined) throw new Error("Service is Undefined");

    try {
        const result = await service("getById", profileId);
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
exports.getProfileListController = async ({service}, {searchTerm}) => {
    if (service === undefined) throw new Error("Service is Undefined");
    try {
        const result = await service("getList", searchTerm);
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
exports.updateProfilePictureController = async ({service}, {profileId, filePath}) => {
    if (service === undefined) throw new Error("Service is Undefined");
    try {
        const result = await service({profileId, filePath}, "addNewPicture");
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
exports.deleteProfilePictureController = async ({service}, {profileId}) => {
    if (service === undefined) throw new Error("Service is Undefined");
    try {
        const result = await service({profileId}, "deletePicture");
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
exports.updateProfileDescriptionController = async ({service}, {profileId, updatedData}) => {
    if (service === undefined) throw new Error("Service is Undefined");
    try {
        const result = await service({profileId, updatedData}, "updateDescription");
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
exports.updateProfileLinksController = async ({service}, {profileId, updatedData}) => {
    if (service === undefined) throw new Error("Service is Undefined");
    try {
        const result = await service({profileId, updatedData}, "updateLinks");
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
exports.addFollowingController = async ({service}, {profileId, followingProfileId}) => {
    if (service === undefined) throw new Error("Service is Undefined");
    try {
        const result = await service({profileId, followingProfileId}, "addFollower");
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
exports.removeFollowingController = async ({service}, {profileId, followingProfileId}) => {
    if (service === undefined) throw new Error("Service is Undefined");
    try {
        const result = await service({profileId, followingProfileId}, "removeFollower");
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
exports.changePrivateStatusController = async ({service}, {profileId, privateStatus}) => {
    if (service === undefined) throw new Error("Service is Undefined");
    try {
        const result = await service({profileId, privateStatus});
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
exports.updateEmailController = async ({service}, {profileId, email}) => {
    if (service === undefined) throw new Error("Service is Undefined");
    try {
        const result = await service({profileId, email});
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