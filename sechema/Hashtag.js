exports.createHashtagCollection = async (db) => {
    try {
        const hashtagSchema = {
            $jsonSchema: {
                bsonType: "object",
                required: ["entityId", "profileId", "timestamp", "hashtag", "entityType"],
                properties: {
                    entityId: {
                        bsonType: "array",
                        items: {bsonType: "string"},
                        description: "must be an array string and is required"
                    },
                    profileId: {
                        bsonType: "array",
                        items: {bsonType: "string"},
                        description: "must be an array string and is required"
                    },
                    timestamp: {bsonType: "string", description: "must be a string (ISO date) and is required"},
                    hashtag: {bsonType: "string", description: "must be a string and is required"},
                    entityType: {bsonType: "string", description: "must be a string and is required"},
                }
            }
        };

        await db.createCollection("hashtag", {
            validator: hashtagSchema,
            validationLevel: "strict",
            validationAction: "error"
        });
        console.log("Hashtag collection created with schema validation!");
    } catch (err) {
        console.error("Error creating Hashtag collection:", err);
    }
}