exports.authBodyValidator = (body = {}, type = "") => {
    const {firstName, lastName, username, password, email} = body;
    switch (type) {
        case "signIn":
            return (username.length > 0 && password.length > 0);
        case "signUp":
            return (
                username.length > 0 &&
                password.length > 0 &&
                firstName.length > 0 &&
                lastName.length > 0 &&
                email.length > 0
            );
        default:
            return "Wrong Validator Type Selected";
    }
};
exports.profileValidator = (data = {}, type = "",) => {
    const {profileId, profileDescription, linkList, privateStatus, email, searchTerm, followingProfileId} = data;
    switch (type) {
        case "idValidator":
            return profileId !== undefined && profileId.length !== 0;
        case "descriptionValidator":
            return profileDescription !== undefined;
        case "linkValidator":
            return linkList !== undefined;
        case "privateValidator":
            return privateStatus !== undefined;
        case "emailValidator":
            return email !== undefined && email.length !== 0;
        case "searchValidator":
            return searchTerm !== undefined;
        case "followingIdValidator":
            return profileId !== undefined && followingProfileId !== undefined;
        default:
            break;
    }
};
exports.postValidator = (data = {}, type = "") => {
    const {postId, profileId, content, isRepost, originalPostId, attachments} = data;
    switch (type) {
        case "postIdValidator":
            return postId !== undefined && postId.length !== 0;
        case "profileIdValidator":
            return profileId !== undefined && profileId.length !== 0;
        case "postDataValidator":
            return content !== undefined && isRepost !== undefined && originalPostId !== undefined && attachments !== undefined;
        default:
            throw new Error("Wrong Validator Option");
    }
};
exports.hashtagValidator = (data = {},) => {
    const {searchTerm} = data;
    return searchTerm !== undefined;
};
exports.mentionValidator = (data = {}, type = "") => {
    const {searchTerm} = data;
    switch (type) {
        case "searchTerm":
            return searchTerm !== undefined;
        default:
            throw new Error("Wrong validator option selected");
    }
}
exports.commentValidator = (data = {}, type = "") => {
    const {postId, profileId, content, commentId, option} = data;
    switch (type) {
        case "postId":
            return postId !== undefined && postId.length > 0;
        case "profileId":
            return profileId !== undefined && profileId.length > 0;
        case "content":
            return content !== undefined && content.length > 0;
        case "commentId":
            return commentId !== undefined && commentId.length > 0;
        case "editOption":
            return option !== undefined || option === "addLike" || option === "removeLike";
        default:
            throw new Error("Validation Option Wrong!")
    }
};
exports.replyValidator = (data = {}, type = "") => {
    const {commentId, profileId, content, option, replyId} = data;
    switch (type) {
        case "profileId":
            return profileId !== undefined && profileId.length > 0;
        case "replyId":
            return replyId !== undefined && replyId.length > 0;
        case "content":
            return content !== undefined && content.length > 0;
        case "commentId":
            return commentId !== undefined && commentId.length > 0;
        case "editOption":
            return option !== undefined || option === "addLike" || option === "removeLike";
        default:
            throw new Error("Validation Option Wrong!")
    }
}