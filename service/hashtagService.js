class HashtagService {
    constructor(hashtagModelObject, findByUsername) {
        this.hashtagModelObject = hashtagModelObject;
        this.findByUsername = findByUsername;
    }

    processHashtag = async (
        hashtagList = [],
        entityId = "",
        profileId = "",
        entityType = "",
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
                    hashtagData.entityType = entityType;
                    return await this.insertNewHashtag(hashtagData);
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
            return await this.hashtagModelObject.findByName(hashtag);
        } catch (err) {
            throw new Error(err);
        }
    };
    getHashtagList = async (searchTerm) => {
        try {
            return await this.hashtagModelObject.getList(searchTerm);
        } catch (err) {
            throw new Error(err);
        }
    };
    insertNewHashtag = async (hashtagData) => {
        /* Here the entity type --> post, comment & reply  */
        try {
            const {entityId, profileId, hashtag, entityType} = hashtagData;
            const newHashtag = {
                entityId: [entityId,],
                profileId: [profileId,],
                timestamp: `${new Date()}`,
                hashtag: hashtag,
                entityType: entityType,
            };
            return await this.hashtagModelObject.add(newHashtag);
        } catch (err) {
            throw new Error(err);
        }
    };
    deleteHashtag = async (hashtagId) => {
        try {
            await this.hashtagModelObject.delete(hashtagId);
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
                hashtagId: _id,
                profileId: profileId,
                entityId: entityId,
            };

            if (option === "addHashtag") return await this.hashtagModelObject.updateHashtag(updateHashtagData);
            else return await this.hashtagModelObject.remove(updateHashtagData);
        } catch (err) {
            throw new Error(err);
        }
    };
}

module.exports = HashtagService;