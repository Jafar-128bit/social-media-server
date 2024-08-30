const deleteFile = require('../util/deleteFile');

class ProfileService {
    constructor(modelObject) {
        this.modelObject = modelObject;
    }

    getProfileService = async (getType = "", getData) => {
        /* Get-Type are two types - getById and getList */
        if (getType === "getById") {
            const profile = await this.modelObject.findProfileById(getData);
            if (profile) return {profile};
            else throw new Error("Profile not found");
        } else {
            const profileList = await this.modelObject.getProfileList(getData);
            if (!profileList) throw new Error('Internal Server Error');
            return {profileList};
        }
    };
    updateProfilePictureService = async ({profileId, filePath}, updateOption = "") => {
        /* Update Option are two types - addNewPicture and deletePicture */
        const profile = await this.modelObject.findProfileById(profileId);
        if (!profile) throw new Error("Profile not found");

        if (updateOption === "addNewPicture") {
            const isFileDeleted = deleteFile(profile);
            const imageFilePath = filePath.replace('public/', '');

            const updatedProfile = await this.modelObject.updateProfileById({
                    profileId,
                    option: "editPicture",
                    imageFilePath
                }
            );

            if (!updatedProfile) throw new Error('Internal Server Error');

            if (updatedProfile.matchedCount > 0) {
                if (updatedProfile.modifiedCount > 0) {
                    return {
                        message: !isFileDeleted
                            ? "Old file not exist, New profile picture updated successfully"
                            : "Profile picture updated successfully",
                        code: "OK",
                        data: {profileImage: imageFilePath}
                    }
                } else {
                    return {
                        message: "No changes made. Profile picture already up-to-date",
                        code: "INFO"
                    }
                }
            } else throw new Error("Failed to Update Picture");
        } else {
            const isFileDeleted = deleteFile(profile);
            if (!isFileDeleted) throw new Error("Error removing profile picture");

            const updatedProfile = await this.modelObject.updateProfileById({
                    profileId,
                    option: "deletePicture",
                }
            );

            if (!updatedProfile) throw new Error('Internal Server Error');

            if (updatedProfile.modifiedCount > 0) {
                return {
                    message: "Profile picture removed successfully",
                    code: "OK"
                }
            } else throw new Error("Failed to Update Picture");
        }
    };
    updatedProfileInfoService = async ({profileId, updatedData}, updateOption = "") => {
        /* Update Option are two types - updateDescription and updateLinks */
        console.log(profileId, updatedData);
        const profile = await this.modelObject.findProfileById(profileId);
        if (!profile) throw new Error("Profile not found");

        const returnFunction = (updatedProfile, {updateValue, updatedData}) => {
            if (updatedProfile.matchedCount > 0) {
                if (updatedProfile.modifiedCount > 0) {
                    return {
                        message: "Profile info updated successfully",
                        code: "OK",
                        data: {[updateValue]: updatedData}
                    };
                } else {
                    return {
                        message: "No changes made. Profile info already up-to-date",
                        code: "INFO"
                    };
                }
            } else throw new Error("Failed to update profile info");
        };

        let updatedProfile;

        if (updateOption === "updateDescription") {
            updatedProfile = await this.modelObject.updateProfileById({
                profileId,
                option: "editDescription",
                data: updatedData
            });
            if (!updatedProfile) throw new Error('Internal Server Error');
            return returnFunction(updatedProfile, {updateValue: "profileDescription", updatedData});
        } else {
            updatedProfile = await this.modelObject.updateProfileById({
                profileId,
                option: "editLinks",
                data: updatedData
            });
            if (!updatedProfile) throw new Error('Internal Server Error');
            return returnFunction(updatedProfile, {updateValue: "profileLink", updatedData});
        }
    };
    updateFollowingService = async ({profileId, followingProfileId}, updateOption = "") => {
        /* Update Option are two types - addFollower and removeFollower */

        const profile = await this.modelObject.findProfileById(profileId);
        const followingProfile = await this.modelObject.findProfileById(followingProfileId);

        if (!profile || !followingProfile) throw new Error("Profile not found");

        const updateResults = await this.modelObject.updateProfileById({
            profileId,
            option: updateOption,
            data: followingProfileId
        });

        let following, follower;
        if (updateOption === "addFollower") {
            const {addFollowing, addFollowers} = updateResults;
            following = addFollowing;
            follower = addFollowers;
        } else {
            const {removeFollowing, removeFollowers} = updateResults;
            following = removeFollowing;
            follower = removeFollowers;
        }

        if (follower === undefined && following === undefined) throw new Error("Internal Server Error");

        if (following.matchedCount > 0) {
            if (follower.modifiedCount > 0) {
                return {
                    message: `Profile ${updateOption === 'addFollower' ? 'following' : 'unfollowing'} updated successfully`,
                    code: "OK",
                };
            } else {
                return {
                    message: `No changes made. Profile ${updateOption === 'addFollower' ? 'following' : 'unfollowing'} already up-to-date`,
                    code: "INFO"
                };
            }
        } else {
            throw new Error("Failed to update profile following");
        }
    };
    changePrivateStatusService = async ({profileId, privateStatus}) => {
        const profile = await this.modelObject.findProfileById(profileId);
        if (!profile) throw new Error("Profile not found");

        const updatedProfile = await this.modelObject.updateProfileById({
                profileId,
                option: "changePrivateStatus",
                data: privateStatus
            }
        );

        if (!updatedProfile) throw new Error('Internal Server Error');

        if (updatedProfile.matchedCount > 0) {
            if (updatedProfile.modifiedCount > 0) {
                return {
                    message: "Profile private status updated successfully",
                    code: "OK",
                    data: {isPrivate: privateStatus}
                }
            } else return {
                message: "No changes made. private status already up-to-date",
                code: "INFO"
            }
        } else throw new Error("Profile not found");
    };
    updateEmailService = async ({profileId, email}) => {
        const profile = await this.modelObject.findProfileById(profileId);
        if (!profile) throw new Error("Profile not found");

        const updatedProfile = await this.modelObject.updateProfileById({
                profileId,
                option: "editEmail",
                data: email
            }
        );

        if (!updatedProfile) throw new Error('Internal Server Error');

        if (updatedProfile.matchedCount > 0) {
            if (updatedProfile.modifiedCount > 0) {
                return {
                    message: "Profile email updated successfully",
                    code: "OK",
                    data: {isPrivate: email}
                }
            } else return {
                message: "No changes made. email already up-to-date",
                code: "INFO"
            }
        } else throw new Error("Profile not found");
    };
}

module.exports = ProfileService;