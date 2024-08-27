exports.createProfileCollection = async (db) => {
    try {
        const userSchema = {
            $jsonSchema: {
                bsonType: "object",
                required: ["profileName",
                    "username",
                    "profileInfo",
                    "followers",
                    "following",
                    "isPrivate",
                    "isActive",
                    "isVerified",
                    "password",
                    "email"],
                properties: {
                    profileName: {
                        bsonType: "string",
                        description: "must be a string and is required"
                    },
                    username: {
                        bsonType: "string",
                        description: "must be a string and is required"
                    },
                    profileInfo: {
                        bsonType: "object",
                        required: ["profileDescription", "profileLinks"],
                        properties: {
                            profileDescription: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
                            profileLinks: {
                                bsonType: "array",
                                items: {
                                    bsonType: "string"
                                },
                                description: "must be an array of strings and is required"
                            }
                        }
                    },
                    profileImage: {
                        bsonType: ["string", "null"],
                        description: "can be string or null"
                    },
                    followers: {
                        bsonType: "array",
                        items: {
                            bsonType: "string"
                        },
                        description: "must be an array of string and is required"
                    },
                    following: {
                        bsonType: "array",
                        items: {
                            bsonType: "string"
                        },
                        description: "must be an array of string and is required"
                    },
                    isPrivate: {
                        bsonType: "bool",
                        description: "must be a boolean and is required"
                    },
                    isActive: {
                        bsonType: "bool",
                        description: "must be a boolean and is required"
                    },
                    isVerified: {
                        bsonType: "bool",
                        description: "must be a boolean and is required"
                    },
                    password: {
                        bsonType: "string",
                        description: "must be a string and is required"
                    },
                    email: {
                        bsonType: "string",
                        description: "must be a string and is required"
                    },
                }
            }
        };

        await db.createCollection("profile", {
            validator: userSchema,
            validationLevel: "strict",
            validationAction: "error"
        });
        console.log("Profile collection created with schema validation!");
    } catch (err) {
        console.error("Error creating Profile collection:", err);
    }
}