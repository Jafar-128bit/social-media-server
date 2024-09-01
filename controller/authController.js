class AuthController {
    constructor(serviceModel) {
        this.serviceModel = serviceModel;
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

    signInController = async ({username, password}) => {
        try {
            const result = await this.serviceModel.signIn({username, password});
            return this.#createResponse(200, "User Authenticated", "OK", result);
        } catch (err) {
            return this.#createResponse(
                err.statusCode || 500,
                err.message || "An error occurred",
                err.code || "ERROR"
            );
        }
    };
    signUpController = async ({firstName, lastName, username, password, email, profileDescription}) => {
        try {
            const result = await this.serviceModel.signUp({
                firstName,
                lastName,
                username,
                password,
                email,
                profileDescription
            });
            return this.#createResponse(200, "User Created!", "OK", result);
        } catch (err) {
            return this.#createResponse(
                err.statusCode || 500,
                err.message || "An error occurred",
                err.code || "ERROR"
            );
        }
    };
}

module.exports = AuthController;