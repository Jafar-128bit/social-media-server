class MentionController {
    constructor(mentionServiceObject) {
        this.mentionServiceObject = mentionServiceObject;
    }

    #createResponse = (statusCode, message, code, result = null) => {
        return {
            statusCode,
            data: {
                message,
                code,
                result,
            }
        };
    };

    getAllMentionData = async (searchTerm = "") => {
        try {
            const result = await this.mentionServiceObject.getMentionList(searchTerm);
        } catch (err) {
            return this.#createResponse(
                err.statusCode || 500,
                err.message || "An error occurred",
                err.code || "ERROR"
            );
        }
    }
}

module.exports = MentionController;