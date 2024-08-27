exports.createReplyCollection = async (db) => {
    try {

        const replySchema = {
            $jsonSchema: {
                bsonType: "object",
                required: ["commentId", "profileId", "timestamp", "content", "likeIds"],
                properties: {
                    commentId: {bsonType: "int", description: "must be an integer and is required"},
                    profileId: {bsonType: "int", description: "must be an integer and is required"},
                    timestamp: {bsonType: "string", description: "must be a string (ISO date) and is required"},
                    content: {bsonType: "string", description: "must be a string and is required"},
                    likeIds: {
                        bsonType: "array",
                        items: {bsonType: "int"},
                        description: "must be an array of integers and is required"
                    }
                }
            }
        };

        await db.createCollection("reply", {
            validator: replySchema,
            validationLevel: "strict",
            validationAction: "error"
        });
        console.log("Reply collection created with schema validation!");

    } catch (err) {
        console.error("Error creating Reply collection:", err);
    }
}