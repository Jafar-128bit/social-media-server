class MentionService {
    constructor(mentionModelObject, findByUsername, getProfileList) {
        this.mentionModelObject = mentionModelObject;
        this.findByUsername = findByUsername;
        this.getProfileList = getProfileList;
    }

    processMention = async (
        mentionList = [],
        entityId = "",
        profileId = "",
        entityType = "",
        processType = ""
    ) => {
        try {
            return await Promise.all(mentionList.map(async (mention) => {
                const isMentionExist = await this.getMention(mention);
                const mentionData = {mentionName: mention, entityId, profileId};

                if (isMentionExist) {
                    return await this.updateMention(mentionData, processType === "addMentionProcess" ? "addMention" : "removeMention");
                } else if (processType === "addMentionProcess") {
                    mentionData.entityType = entityType;
                    return await this.insertNewMention(mentionData);
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
            return await this.getProfileList(searchTerm);
        } catch (err) {
            throw new Error(err);
        }
    };
    getMention = async (mention) => {
        try {
            return await this.mentionModelObject.findById(mention);
        } catch (err) {
            throw new Error(err);
        }
    };
    insertNewMention = async (mentionData = {}) => {
        /* Here the entity type --> post, comment & reply  */
        try {
            const {entityId, profileId, mentionName, entityType} = mentionData;
            const username = mentionName.split('@')[1];
            const mentionedProfile = await this.findByUsername(username);
            const {_id} = mentionedProfile;

            const newMention = {
                entityId: [entityId,],
                profileId: [profileId,],
                timestamp: `${new Date()}`,
                mentionedProfileId: _id.toHexString(),
                entityType: entityType
            };
            return await this.mentionModelObject.add(newMention);
        } catch (err) {
            throw new Error(err);
        }
    };
    deleteMention = async (mentionId) => {
        try {
            await this.mentionModelObject.delete(mentionId);
        } catch (err) {
            throw new Error(err);
        }
    };
    updateMention = async (mentionData = {}, option = "") => {
        /* options are two types --> removeMention & addMention */
        try {
            const {mentionName, profileId, entityId} = mentionData;
            const getMentionData = await this.getMention(mentionName);
            const {_id} = getMentionData;
            const updateMentionData = {
                mentionId: _id,
                profileId: profileId,
                entityId: entityId,
            };

            if (option === "addMention") return await this.mentionModelObject.update(updateMentionData);
            else return await this.mentionModelObject.remove(updateMentionData);
        } catch (err) {
            throw new Error(err);
        }
    };
}

module.exports = MentionService;