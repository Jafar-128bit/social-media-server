const {findProfileById, getProfileList, updateProfileById} = require('../model/profileModel');
const deleteFile = require('../util/deleteFile');

exports.getProfileService = async (getType = "", getData) => {
    /* Get-Type are two types - getById and getList */
    if (getType === "getById") {
        const profile = await findProfileById(getData);
        if (profile) return {profile};
        else throw new Error("Profile not found");
    } else {
        const profileList = await getProfileList(getData);
        return {profileList};
    }
};
exports.updateProfilePictureService = async ({profileId, filePath}, updateOption = "") => {
    /* Update Option are two types - addNewPicture and deletePicture */
    const profile = await findProfileById(profileId);
    if (!profile) throw new Error("Profile not found");

    if (updateOption === "addNewPicture") {
        const isFileDeleted = deleteFile(profile);
        const imageFilePath = filePath.replace('public/', '');

        const updatedProfile = await updateProfileById({
                profileId,
                option: "editPicture",
                imageFilePath
            }
        );

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

        const updatedProfile = await updateProfileById({
                profileId,
                option: "deletePicture",
            }
        );

        if (updatedProfile.modifiedCount > 0) {
            return {
                message: "Profile picture removed successfully",
                code: "OK"
            }
        } else throw new Error("Failed to Update Picture");
    }
};
exports.updatedProfileInfoService = async ({ profileId, updatedData }, updateOption = "") => {
    /* Update Option are two types - updateDescription and updateLinks */
    const profile = await findProfileById(profileId);
    if (!profile) throw new Error("Profile not found");

    const returnFunction = (updatedProfile, { updateValue, updatedData }) => {
        if (updatedProfile.matchedCount > 0) {
            if (updatedProfile.modifiedCount > 0) {
                return {
                    message: "Profile info updated successfully",
                    code: "OK",
                    data: { [updateValue]: updatedData }
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
        updatedProfile = await updateProfileById({
            profileId,
            option: "editDescription",
            data: updatedData
        });
        return returnFunction(updatedProfile, { updateValue: "profileDescription", updatedData });
    } else {
        updatedProfile = await updateProfileById({
            profileId,
            option: "editLink",
            data: updatedData
        });
        return returnFunction(updatedProfile, { updateValue: "profileLink", updatedData });
    }
};
exports.updateFollowingService = async ({ profileId, followingProfileId }, updateOption = "") => {
    /* Update Option are two types - addFollower and removeFollower */

    const profile = await findProfileById(profileId);
    const followingProfile = await findProfileById(followingProfileId);

    if (!profile || !followingProfile) throw new Error("Profile not found");

    const updateResults = await updateProfileById({
        profileId,
        option: updateOption,
        data: followingProfileId
    });

    const { matchedCount, modifiedCount } = updateResults;

    if (matchedCount > 0) {
        if (modifiedCount > 0) {
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
exports.changePrivateStatusService = async ({profileId, privateStatus}) => {
    const profile = await findProfileById(profileId);
    if (!profile) throw new Error("Profile not found");

    const updatedProfile = await updateProfileById({
            profileId,
            option: "changePrivateStatus",
            data: privateStatus
        }
    );

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
exports.updateEmailService = async ({profileId, email}) => {
    const profile = await findProfileById(profileId);
    if (!profile) throw new Error("Profile not found");

    const updatedProfile = await updateProfileById({
            profileId,
            option: "editEmail",
            data: email
        }
    );

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

// exports.addFollowing = async ({profileId, followingProfileId}) => {
//     const profile = await findProfileById(profileId);
//     const followingProfile = await findProfileById(followingProfileId);
//
//     if (!profile && !followingProfile) throw new Error("Profile not found");
//
//     const {addFollowing, addFollowers} = await updateProfileById({
//             profileId,
//             option: "addFollower",
//             data: followingProfileId
//         }
//     );
//
//     if (addFollowing.matchedCount > 0 && addFollowers.matchedCount > 0) {
//         if (addFollowing.modifiedCount > 0 && addFollowers.modifiedCount > 0) {
//             return {
//                 message: "Profile following updated successfully",
//                 code: "OK",
//             }
//         } else return {
//             message: "No changes made. Profile following already up-to-date",
//             code: "INFO"
//         }
//     } else return throw new Error("Profile not found");
// };
// exports.removeFollowing = async ({profileId, followingProfileId}) => {
//     const profile = await findProfileById(profileId);
//     const followingProfile = await findProfileById(followingProfileId);
//
//     if (!profile && !followingProfile) throw new Error("Profile not found");
//
//     const {removeFollowing, removeFollowers} = await updateProfileById({
//             profileId,
//             option: "removeFollower",
//             data: followingProfileId
//         }
//     );
//
//     if (removeFollowing.matchedCount > 0 && removeFollowers.matchedCount > 0) {
//         if (removeFollowing.modifiedCount > 0 && removeFollowers.modifiedCount > 0) {
//             return {
//                 message: "Profile following updated successfully",
//                 code: "OK",
//             }
//         } else return {
//             message: "No changes made. Profile following already up-to-date",
//             code: "INFO"
//         }
//     } else return throw new Error("Profile not found");
// };