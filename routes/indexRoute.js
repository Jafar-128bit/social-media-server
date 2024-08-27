const {authBodyValidator, profileValidator} = require('../util/reqValidator');
const uploadFileMiddleware = require('../middleware/fileUplaod');
const {signInController, signUpController} = require('../controller/authController');
const {
    getProfileByIdController,
    getProfileListController,
    updateProfilePictureController,
    deleteProfilePictureController,
    updateProfileDescriptionController,
    updateProfileLinksController,
    addFollowingController,
    removeFollowingController,
    changePrivateStatusController,
    updateEmailController
} = require('../controller/profileController');

const authRouter = require('./authRouter');
const postRouter = require('./postRouter');
const commentRouter = require('./commentRouter');
const replyRouter = require('./replyRouter');
const profileRouter = require('./profileRouter');

const indexRoute = (app, apiVersionRoute) => {
    app.use(`${apiVersionRoute}/auth`, authRouter({
            signInController,
            signUpController
        },
        authBodyValidator
    ));
    app.use(`${apiVersionRoute}/post`, postRouter);
    app.use(`${apiVersionRoute}/comment`, commentRouter);
    app.use(`${apiVersionRoute}/reply`, replyRouter);
    app.use(`${apiVersionRoute}/profile`, profileRouter({
            getProfileByIdController,
            getProfileListController,
            updateProfilePictureController,
            deleteProfilePictureController,
            updateProfileDescriptionController,
            updateProfileLinksController,
            addFollowingController,
            removeFollowingController,
            changePrivateStatusController,
            updateEmailController
        }, profileValidator, {uploadFileMiddleware}
    ));
}

module.exports = indexRoute;