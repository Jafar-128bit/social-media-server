exports.createPostCollection = async (db) => {
    try {
        const postSchema = {
            $jsonSchema: {
                bsonType: "object",
                required: ["profileId", "timestamp", "content", "likeIds", "isRepost"],
                properties: {
                    profileId: {bsonType: "string", description: "must be a string and is required"},
                    timestamp: {bsonType: "string", description: "must be a string (ISO date) and is required"},
                    content: {bsonType: "string", description: "must be a string and is required"},
                    likeIds: {
                        bsonType: "array",
                        items: {bsonType: "string"},
                        description: "must be an array of integers and is required"
                    },
                    isRepost: {bsonType: "bool", description: "must be a boolean and is required"},
                    originalPostId: {bsonType: ["string", "null"], description: "must be an integer if isRepost is true"},
                    attachments: {
                        bsonType: "array",
                        items: {
                            bsonType: "object",
                            required: ["type", "url"],
                            properties: {
                                type: {
                                    bsonType: "string",
                                    enum: ["image", "gif", "video"],
                                    description: "must be either 'image', 'gif', or 'video' and is required"
                                },
                                url: {bsonType: "string", description: "must be a string (URL) and is required"}
                            }
                        },
                        description: "must be an array of attachments"
                    }
                }
            }
        };

        await db.createCollection("post", {
            validator: postSchema,
            validationLevel: "strict",
            validationAction: "error"
        });
        console.log("Post collection created with schema validation!");
    } catch (err) {
        console.error("Error creating Post collection:", err);
    }
}