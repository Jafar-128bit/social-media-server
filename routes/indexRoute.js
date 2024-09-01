const {
    authBodyValidator,
    postValidator,
    profileValidator,
    hashtagValidator,
    mentionValidator,
    commentValidator,
    replyValidator
} = require('../util/reqValidator');
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
const MentionControllerClass = require('../controller/mentionController');

const mentionModelObject = new MentionModelClass();
const mentionServiceObject = new MentionServiceClass(mentionModelObject,
    profileModelObject.findByUsername,
    profileModelObject.getProfileList);
const mentionControllerObject = new MentionControllerClass(mentionServiceObject);
/* ************ */

/* Hashtag Class and Objects */
const HashtagModelClass = require('../model/hashtagModel');
const HashtagServiceClass = require('../service/hashtagService');
const HashtagControllerClass = require('../controller/hashtagController');

const hashtagModelObject = new HashtagModelClass();
const hashtagServiceObject = new HashtagServiceClass(hashtagModelObject);
const hashtagControllerObject = new HashtagControllerClass(hashtagServiceObject);
/* ************ */

/* Post Class and objects */
const PostModelClass = require('../model/postModel');
const PostServiceClass = require('../service/postService');
const PostControllerClass = require('../controller/postController');

const postModelObject = new PostModelClass();
const postServiceObject = new PostServiceClass(postModelObject);
const postControllerObject = new PostControllerClass(postServiceObject, mentionServiceObject.processMention, hashtagServiceObject.processHashtag);
/* ************ */

/* Comment Class and objects */
const CommentModelClass = require('../model/commentModel');
const CommentServiceClass = require('../service/commentService');
const CommentControllerClass = require('../controller/commentController');

const commentModelObject = new CommentModelClass();
const commentServiceObject = new CommentServiceClass(commentModelObject);
const commentControllerObject = new CommentControllerClass(commentServiceObject);
/* ************ */

/* Reply Class and objects */
const ReplyModelClass = require('../model/replyModel');
const ReplyServiceClass = require('../service/replyService');
const ReplyControllerClass = require('../controller/replyController');

const replyModelObject = new ReplyModelClass();
const replyServiceObject = new ReplyServiceClass(replyModelObject);
const replyControllerObject = new ReplyControllerClass(replyServiceObject);
/* ************ */

const authRouter = require('./authRouter');
const postRouter = require('./postRouter');
const commentRouter = require('./commentRouter');
const replyRouter = require('./replyRouter');
const mentionRouter = require('./mentionRoute');
const hashtagRouter = require('./hashtagRouter');
const profileRouter = require('./profileRouter');

const indexRoute = (app, apiVersionRoute) => {
    app.use(`${apiVersionRoute}/auth`, authRouter(authControllerObject, authBodyValidator));
    app.use(`${apiVersionRoute}/post`, postRouter(postControllerObject, postValidator, {}));
    app.use(`${apiVersionRoute}/comment`, commentRouter(commentControllerObject, commentValidator, {}));
    app.use(`${apiVersionRoute}/reply`, replyRouter(replyControllerObject, replyValidator, {}));
    app.use(`${apiVersionRoute}/hashtag`, hashtagRouter(hashtagControllerObject, hashtagValidator, {}));
    app.use(`${apiVersionRoute}/mention`, mentionRouter(mentionControllerObject, mentionValidator, {}));
    app.use(`${apiVersionRoute}/profile`, profileRouter(profileControllerObject, profileValidator, {uploadFileMiddleware}));
}

module.exports = indexRoute;