const {createPostCollection} = require('./Post');
const {createCommentCollection} = require('./Comment');
const {createReplyCollection} = require('./Reply');
const {createProfileCollection} = require('./Profile');
const {createMentionCollection} = require('./Mention');
const {createHashtagCollection} = require('./Hashtag');

const createCollections = async (getDb) => {
    try {
        const db = getDb();

        const createCollection = async (collectionName, {createCollection}) => {
            const collection = await db.listCollections({name: `${collectionName}`}).toArray();
            if (collection.length > 0) console.log(`${collectionName} collection already exists. Skipping creation.`);
            else await createCollection(db);
        }

        await createCollection("post", {createPostCollection});
        await createCollection("comment", {createCommentCollection});
        await createCollection("reply", {createReplyCollection});
        await createCollection("profile", {createProfileCollection});
        await createCollection("mention", {createMentionCollection});
        await createCollection("hashtag", {createHashtagCollection});

    } catch (err) {
        console.error("Error creating collections:", err);
    }
}

module.exports = createCollections;
