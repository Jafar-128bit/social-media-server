// External Dependencies
const Queue = require('../class/ProcessQueue');
const ISC = require("../class/InterServiceCommunication");

// Middlewares
const uploadFileMiddleware = require('../middleware/fileUplaod');
const authorizeUser = require('../middleware/authorizeUser');
const serviceRegistrationMiddleware = require('../middleware/serviceRegistrationMiddleware');

// Validators and Routers
const Validator = require('../util/reqValidator');
const RouterObject = require('../routes/indexRouter');

/* All Model Classes */
const AuthModelClass = require("../model/authModel");
const ProfileModelClass = require("../model/profileModel");
const MentionModelClass = require("../model/mentionModel");
const HashtagModelClass = require("../model/hashtagModel");
const ReplyModelClass = require("../model/replyModel");
const CommentModelClass = require("../model/commentModel");
const PostModelClass = require("../model/postModel");
/* All Service Classes */
const AuthServiceClass = require('../service/authService');
const ProfileServiceClass = require('../service/profileService');
const MentionServiceClass = require('../service/mentionService');
const HashtagServiceClass = require('../service/hashtagService');
const ReplyServiceClass = require('../service/replyService');
const CommentServiceClass = require('../service/commentService');
const PostServiceClass = require('../service/postService');
/* All Controller Classes */
const AuthControllerClass = require("../controller/authController");
const ProfileControllerClass = require("../controller/profileController");
const MentionControllerClass = require("../controller/mentionController");
const HashtagControllerClass = require("../controller/hashtagController");
const ReplyControllerClass = require("../controller/replyController");
const CommentControllerClass = require("../controller/commentController");
const PostControllerClass = require("../controller/postController");

// Process Queue
const processQueue = new Queue();

// Instantiate Models
const authModel = new AuthModelClass();
const profileModel = new ProfileModelClass();
const mentionModel = new MentionModelClass();
const hashtagModel = new HashtagModelClass();
const replyModel = new ReplyModelClass();
const commentModel = new CommentModelClass();
const postModel = new PostModelClass();

// Instantiate Services with their respective models
const authService = new AuthServiceClass(ISC, authModel);
const profileService = new ProfileServiceClass(ISC, profileModel);
const mentionService = new MentionServiceClass(ISC, mentionModel);
const hashtagService = new HashtagServiceClass(ISC, hashtagModel);
const replyService = new ReplyServiceClass(ISC, replyModel);
const commentService = new CommentServiceClass(ISC, commentModel);
const postService = new PostServiceClass(ISC, postModel);

// Instantiate Controllers with their respective services
const authController = new AuthControllerClass(authService);
const profileController = new ProfileControllerClass(profileService);
const mentionController = new MentionControllerClass(mentionService);
const hashtagController = new HashtagControllerClass(hashtagService);
const replyController = new ReplyControllerClass(replyService);
const commentController = new CommentControllerClass(commentService);
const postController = new PostControllerClass(postService);

// Define Service Networks
const serviceNetworks = {
    post: {
        add: {
            processHashtag: hashtagService.processHashtag,
            processMention: mentionService.processMention,
            getByUsername: profileService.getProfileService,
        },
        remove: {
            processHashtag: hashtagService.processHashtag,
            processMention: mentionService.processMention,
            getCommentIdList: commentService.getCommentIdListByPostId,
        },
    },
    comment: {
        add: {
            processHashtag: hashtagService.processHashtag,
            processMention: mentionService.processMention,
            getByUsername: profileService.getProfileService,
        },
        remove: {
            processHashtag: hashtagService.processHashtag,
            processMention: mentionService.processMention,
            getReplyIdList: replyService.getReplyIdListByCommentId,
        },
    },
    reply: {
        add: {
            processHashtag: hashtagService.processHashtag,
            processMention: mentionService.processMention,
            getByUsername: profileService.getProfileService,
        },
        remove: {
            processHashtag: hashtagService.processHashtag,
            processMention: mentionService.processMention,
            getReplyIdList: replyService.getReplyIdListByCommentId,
        },
    },
};

// Middleware Objects
const middlewareObjects = {
    post: {
        serviceRegistrationAddEntity: serviceRegistrationMiddleware(ISC, serviceNetworks.post.add),
        serviceRegistrationRemoveEntity: serviceRegistrationMiddleware(ISC, serviceNetworks.post.remove),
        authMiddleware: authorizeUser,
    },
    comment: {
        serviceRegistrationAddEntity: serviceRegistrationMiddleware(ISC, serviceNetworks.comment.add),
        serviceRegistrationRemoveEntity: serviceRegistrationMiddleware(ISC, serviceNetworks.comment.remove),
        authMiddleware: authorizeUser,
    },
    reply: {
        serviceRegistrationAddEntity: serviceRegistrationMiddleware(ISC, serviceNetworks.reply.add),
        serviceRegistrationRemoveEntity: serviceRegistrationMiddleware(ISC, serviceNetworks.reply.remove),
        authMiddleware: authorizeUser,
    },
    profile: {
        fileProcess: uploadFileMiddleware,
        authMiddleware: authorizeUser,
    },
    specialWord: {
        authMiddleware: authorizeUser,
    },
};

// Router Initialization
const initializeRoutes = (app, apiVersionRoute) => {
    app.use(`${apiVersionRoute}/auth`, RouterObject.authRouter(authController, Validator.authBodyValidator));
    app.use(`${apiVersionRoute}/post`, RouterObject.postRouter(postController, Validator.postValidator, middlewareObjects.post));
    app.use(`${apiVersionRoute}/comment`, RouterObject.commentRouter(commentController, Validator.commentValidator, middlewareObjects.comment));
    app.use(`${apiVersionRoute}/reply`, RouterObject.replyRouter(replyController, Validator.replyValidator, middlewareObjects.reply));
    app.use(`${apiVersionRoute}/hashtag`, RouterObject.hashtagRouter(hashtagController, Validator.hashtagValidator, middlewareObjects.specialWord));
    app.use(`${apiVersionRoute}/mention`, RouterObject.mentionRouter(mentionController, Validator.mentionValidator, middlewareObjects.specialWord));
    app.use(`${apiVersionRoute}/profile`, RouterObject.profileRouter(profileController, Validator.profileValidator, middlewareObjects.profile));
};

// Export the router initialization function
module.exports = initializeRoutes;
