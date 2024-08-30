const {authBodyValidator, postValidator, profileValidator} = require('../util/reqValidator');
const uploadFileMiddleware = require('../middleware/fileUplaod');

/* Authentication Class and Objects */
const AuthModelClass = require('../model/authModel');
const AuthServiceClass = require('../service/authService');
const AuthControllerClass = require('../controller/authController');

const authModelObject = new AuthModelClass();
const authServiceObject = new AuthServiceClass(authModelObject);
const authControllerObject = new AuthControllerClass(authServiceObject);
/* ************ */

/* Profile Class and Objects */
const ProfileModelClass = require('../model/profileModel');
const ProfileServiceClass = require('../service/profileService');
const ProfileControllerClass = require('../controller/profileController');

const profileModelObject = new ProfileModelClass();
const profileServiceObject = new ProfileServiceClass(profileModelObject);
const profileControllerObject = new ProfileControllerClass(profileServiceObject);
/* ************ */

/* Mention Class and Objects */
const MentionModelClass = require('../model/mentionModel');
const MentionServiceClass = require('../service/mentionService');

const mentionModelObject = new MentionModelClass();
const mentionServiceObject = new MentionServiceClass(mentionModelObject, profileModelObject.findByUsername);

/* Post Class and objects */
const PostModelClass = require('../model/postModel');
const PostServiceClass = require('../service/postService');
const PostControllerClass = require('../controller/postController');

const postModelObject = new PostModelClass();
const postServiceObject = new PostServiceClass(postModelObject);
const postControllerObject = new PostControllerClass(postServiceObject, mentionServiceObject.processMention);
/* ************ */

const authRouter = require('./authRouter');
const postRouter = require('./postRouter');
const commentRouter = require('./commentRouter');
const replyRouter = require('./replyRouter');
const profileRouter = require('./profileRouter');

const indexRoute = (app, apiVersionRoute) => {
    app.use(`${apiVersionRoute}/auth`, authRouter(authControllerObject, authBodyValidator));
    app.use(`${apiVersionRoute}/post`, postRouter(postControllerObject, postValidator, {}));
    app.use(`${apiVersionRoute}/comment`, commentRouter);
    app.use(`${apiVersionRoute}/reply`, replyRouter);
    app.use(`${apiVersionRoute}/profile`, profileRouter(profileControllerObject, profileValidator, {uploadFileMiddleware}));
}

module.exports = indexRoute;