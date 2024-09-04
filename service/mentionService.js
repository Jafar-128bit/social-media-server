class MentionService {
    constructor(ISC, modelObject) {
        this.modelObject = modelObject;
        this.ISC = ISC;
    }

    processMention = async (
        mentionList = [],
        entityId = "",
        profileId = "",
        processType = "",
    ) => {
        try {
            return await Promise.all(mentionList.map(async (mention) => {
                const isMentionExist = await this.getMention(mention.split('@')[1]);
                const mentionData = {mentionName: mention.split('@')[1], entityId, profileId};
                if (isMentionExist) {
                    return await this.updateMention(mentionData, processType === "addMentionProcess" ? "addMention" : "removeMention");
                } else if (processType === "addMentionProcess") {
                    return await this.addMention(mentionData);
                } else {
                    throw new Error(`Mention ${mention} does not exist anymore!`);
                }
            }));
        } catch (err) {
            throw new Error(err);
        }
    };

    getMentionList = async (searchTerm) => {
        try {
            const result = await this.ISC.resolveService('getByUsername')("getList", searchTerm);
            return result;
        } catch (err) {
            throw new Error(err);
        }
    };

    getMention = async (mentionName) => {
        try {
            const mentionedProfile = await this.ISC.resolveService('getByUsername')("byUsername", mentionName);
            const {_id} = mentionedProfile;
            return await this.modelObject.findById(_id.toHexString());
        } catch (err) {
            throw new Error(err);
        }
    };

    addMention = async (mentionData = {}) => {
        try {
            const {entityId, profileId, mentionName} = mentionData;
            const mentionedProfile = await this.ISC.resolveService('getByUsername')("byUsername", mentionName);
            const {_id} = mentionedProfile;

            const newMention = {
                entityId: [entityId],
                profileId: [profileId],
                timestamp: `${new Date()}`,
                mentionedProfileId: _id.toHexString(),
            };
            return await this.modelObject.add(newMention);
        } catch (err) {
            throw new Error(err);
        }
    };

    deleteMention = async (mentionId) => {
        try {
            await this.modelObject.delete(mentionId);
        } catch (err) {
            throw new Error(err);
        }
    };

    updateMention = async (mentionData = {}, option = "") => {
        try {
            const {mentionName, profileId, entityId} = mentionData;
            const getMentionData = await this.getMention(mentionName);
            const {_id} = getMentionData;
            const updateMentionData = {
                mentionId: _id.toHexString(),
                profileId: profileId,
                entityId: entityId,
            };

            if (option === "addMention") {
                return await this.modelObject.update(updateMentionData);
            } else {
                return await this.modelObject.remove(updateMentionData);
            }
        } catch (err) {
            throw new Error(err);
        }
    };
}

module.exports = MentionService;