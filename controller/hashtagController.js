class HashtagController {
    constructor(hashtagService) {
        this.hashtagService = hashtagService;
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
    searchHashtag = async (searchTerm) => {
        try {
            const result = await this.hashtagService.getHashtagList(searchTerm);
            return this.#createResponse(200, "Found hashtag list", "OK", result);
        } catch (err) {
            return this.#createResponse(err.statusCode || 500, err.message || "An error occurred", err.code || "ERROR");
        }
    };
}

module.exports = HashtagController;