class HashtagService {
    constructor(ISC, modelObject) {
        this.modelObject = modelObject;
        this.ISC = ISC;
    }

    processHashtag = async (
        hashtagList = [],
        entityId = "",
        profileId = "",
        processType = ""
    ) => {
        /* There are two process types --> addHashtagProcess & removeHashtagProcess */
        try {
            return await Promise.all(hashtagList.map(async (hashtag) => {
                const isHashtagExist = await this.getHashtag(hashtag);
                const hashtagData = {hashtag: hashtag, entityId, profileId};

                if (isHashtagExist) {
                    return await this.updateHashtag(hashtagData, processType === "addHashtagProcess" ? "addHashtag" : "removeHashtag");
                } else if (processType === "addHashtagProcess") {
                    return await this.addHashtag(hashtagData);
                } else {
                    throw new Error(`Hashtag ${hashtag} does not exist anymore!`);
                }
            }));
        } catch (err) {
            throw new Error(err);
        }
    };

    getHashtag = async (hashtag) => {
        try {
            return await this.modelObject.findByName(hashtag);
        } catch (err) {
            throw new Error(err);
        }
    };

    getHashtagList = async (searchTerm) => {
        try {
            return await this.modelObject.findBySearch(searchTerm);
        } catch (err) {
            throw new Error(err);
        }
    };

    addHashtag = async (hashtagData) => {
        /* Here the entity type --> post, comment & reply  */
        try {
            const {entityId, profileId, hashtag} = hashtagData;
            const newHashtag = {
                entityId: [entityId],
                profileId: [profileId],
                timestamp: `${new Date()}`,
                hashtag: hashtag,
            };
            return await this.modelObject.add(newHashtag);
        } catch (err) {
            throw new Error(err);
        }
    };

    deleteHashtag = async (hashtagId) => {
        try {
            await this.modelObject.delete(hashtagId);
        } catch (err) {
            throw new Error(err);
        }
    };

    updateHashtag = async (hashtagData = {}, option = "") => {
        /* options are two types --> removeHashtag & addHashtag */
        try {
            const {hashtag, profileId, entityId} = hashtagData;
            const getHashtagData = await this.getHashtag(hashtag);
            const {_id} = getHashtagData;
            const updateHashtagData = {
                hashtagId: _id.toHexString(),
                profileId: profileId,
                entityId: entityId,
            };

            if (option === "addHashtag") {
                return await this.modelObject.update(updateHashtagData);
            } else {
                return await this.modelObject.remove(updateHashtagData);
            }
        } catch (err) {
            throw new Error(err);
        }
    };
}

module.exports = HashtagService;