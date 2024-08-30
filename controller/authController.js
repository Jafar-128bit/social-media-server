class AuthController {
    constructor(serviceModel) {
        this.serviceModel = serviceModel;
    }

    signInController = async ({username, password}) => {
        try {
            const result = await this.serviceModel.signIn({username, password});
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
    signUpController = async ({firstName, lastName, username, password, email, profileDescription}) => {
        try {
            const result = await this.serviceModel.signUp(
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
}

module.exports = AuthController;