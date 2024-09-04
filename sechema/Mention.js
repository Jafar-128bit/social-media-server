exports.createMentionCollection = async (db) => {
    try {
        const mentionSchema = {
            $jsonSchema: {
                bsonType: "object",
                required: ["entityId", "profileId", "timestamp", "mentionedProfileId",],
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
                    mentionedProfileId: {bsonType: "string", description: "must be a string and is required"},
                }
            }
        };

        await db.createCollection("mention", {
            validator: mentionSchema,
            validationLevel: "strict",
            validationAction: "error"
        });
        console.log("Mention collection created with schema validation!");
    } catch (err) {
        console.error("Error creating Mention collection:", err);
    }
}