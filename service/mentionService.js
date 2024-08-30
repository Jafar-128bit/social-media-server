class MentionService {
    constructor(mentionModelObject, findByUsername) {
        this.mentionModelObject = mentionModelObject;
        this.findByUsername = findByUsername;
    }

    processMention = async (
        mentionList = [],
        entityId = "",
        profileId = "",
        entityType = "",
        processType = ""
    ) => {
        try {
            /* There are two process types --> addMentionProcess & removeMentionProcess */
            if (processType === "addMentionProcess") {
                let resultArray = [];
                for (const mention of mentionList) {
                    const isMentionExist = await this.getMention(mention);
                    if (isMentionExist) {
                        const mentionData = {mentionName: mention, entityId, profileId};
                        const result = await this.updateMention(mentionData, "addMention");
                        resultArray.push(result);
                    } else {
                        const mentionData = {entityId, profileId, mention, entityType};
                        const result = await this.insertNewMention(mentionData);
                        resultArray.push(result);
                    }
                }
                return resultArray;
            } else {
                let resultArray = [];
                for (const mention of mentionList) {
                    const isMentionExist = await this.getMention(mention);
                    if (isMentionExist) {
                        const mentionData = {mentionName: mention, entityId, profileId};
                        const result = await this.updateMention(mentionData, "removeMention");
                        resultArray.push(result);
                    } else new Error('Mention dose not exist anymore!');
                }
                return resultArray;
            }
        } catch (err) {
            throw new Error(err);
        }
    }
    getMention = async (mentionName) => {
        try {
            const mentionedProfile = await this.findByUsername(mentionName);
            const {_id} = mentionedProfile;
            return await this.mentionModelObject.findById(_id);
        } catch (err) {
            throw new Error(err);
        }
    };
    insertNewMention = async (mentionData = {}) => {
        /* Here the entity type --> post, comment & reply  */
        try {
            const {entityId, profileId, mentionName, entityType} = mentionData;

            const mentionedProfile = await this.findByUsername(mentionName);
            const {_id} = mentionedProfile;

            const newMention = {
                entityId: [entityId,],
                profileId: [profileId,],
                mentionedProfileId: _id,
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
    }
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

module
    .exports = MentionService;