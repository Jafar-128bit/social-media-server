const {createPostCollection} = require('./Post');
const {createCommentCollection} = require('./Comment');
const {createReplyCollection} = require('./Reply');
const {createProfileCollection} = require('./Profile');

const createCollections = async (getDb) => {
    try {
        const db = getDb();

        // Check if the Post collection already exists
        const postCollections = await db.listCollections({name: 'post'}).toArray();
        if (postCollections.length > 0) {
            console.log("Post collection already exists. Skipping creation.");
        } else {
            await createPostCollection(db);
        }

        // Check if the Comment collection already exists
        const commentCollections = await db.listCollections({name: 'comment'}).toArray();
        if (commentCollections.length > 0) {
            console.log("Comment collection already exists. Skipping creation.");
        } else {
            await createCommentCollection(db);
        }

        // Check if the Reply collection already exists
        const replyCollections = await db.listCollections({name: 'reply'}).toArray();
        if (replyCollections.length > 0) {
            console.log("Reply collection already exists. Skipping creation.");
        } else {
            await createReplyCollection(db);
        }

        // Check if the Profile collection already exists
        const profileCollections = await db.listCollections({name: 'profile'}).toArray();
        if (profileCollections.length > 0) {
            console.log("Profile collection already exists. Skipping creation.");
        } else {
            await createProfileCollection(db);
        }
    } catch (err) {
        console.error("Error creating collections:", err);
    }
}

module.exports = createCollections;
