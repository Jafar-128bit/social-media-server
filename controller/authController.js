const {signIn, signUp} = require('../service/authService');

exports.signInController = async ({username, password}) => {
    try {
        const result = await signIn({username, password});
        return {
            statusCode: 202,
            data: {
                message: "User Authenticated",
                code: "OK",
                token: result.token
            }
        };
    } catch (err) {
        return {
            statusCode: 404,
            data: {
                message: err,
                code: "BAD",
            }
        };
    }
};
exports.signUpController = async ({firstName, lastName, username, password, email, profileDescription}) => {
    try {
        const result = await signUp(
            {
                firstName,
                lastName,
                username,
                password,
                email,
                profileDescription
            });
        return {
            statusCode: 202,
            data: {
                message: "User Created!",
                code: "OK",
                result,
            }
        };
    } catch (err) {
        return {
            statusCode: 404,
            data: {
                message: err,
                code: "BAD",
            }
        };
    }
};