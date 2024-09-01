exports.createCommentCollection = async (db) => {
    try {
        const commentSchema = {
            $jsonSchema: {
                bsonType: "object",
                required: ["postId", "profileId", "timestamp", "content", "likeIds"],
                properties: {
                    postId: {bsonType: "string", description: "must be an string and is required"},
                    profileId: {bsonType: "string", description: "must be an string and is required"},
                    timestamp: {bsonType: "string", description: "must be a string (ISO date) and is required"},
                    content: {bsonType: "string", description: "must be a string and is required"},
                    likeIds: {
                        bsonType: "array",
                        items: {bsonType: "string"},
                        description: "must be an array of string and is required"
                    }
                }
            }
        };

        await db.createCollection("comment", {
            validator: commentSchema,
            validationLevel: "strict",
            validationAction: "error"
        });
        console.log("Comment collection created with schema validation!");
    } catch (err) {
        console.error("Error creating Comment collection:", err);
    }
}