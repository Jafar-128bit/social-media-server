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
}