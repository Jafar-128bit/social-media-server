const {getDb} = require('../config/databaseConfig');
const {ObjectId} = require("mongodb");

class ProfileModel {
    constructor() {
        this.collection = getDb().db.collection('profile');
    }

    findProfileById = async (profileId) => await this.collection.findOne({_id: new ObjectId(profileId)});
    findByUsername = async (username) => await this.collection.findOne({username});
    getProfileList = async (searchTerm) => await this.collection.find({
        $or: [
            {username: {$regex: searchTerm, $options: 'i'}},
            {profileName: {$regex: searchTerm, $options: 'i'}}
        ]
    }).toArray();
    updateProfileById = async ({profileId, option, data}) => {
        const db = getDb();
        switch (option) {
            case "editPicture":
                return await this.collection.updateOne(
                    {_id: new ObjectId(profileId)},
                    {$set: {profileImage: data}},
                );
            case "deletePicture":
                return await this.collection.updateOne(
                    {_id: new ObjectId(profileId)},
                    {$set: {profileImage: null}}
                );
            case "editDescription":
                return await this.collection.updateOne(
                    {_id: new ObjectId(profileId)},
                    {$set: {"profileInfo.profileDescription": data}}
                );
            case "editLinks":
                return await this.collection.updateOne(
                    {_id: new ObjectId(profileId)},
                    {$set: {"profileInfo.profileLinks": data}}
                );
            case "addFollower":
                const addFollowing = await this.collection.updateOne(
                    {_id: new ObjectId(profileId)},
                    {$push: {following: data}}
                );
                const addFollowers = await this.collection.updateOne(
                    {_id: new ObjectId(data)},
                    {$push: {followers: profileId}}
                );
                return {addFollowing, addFollowers};
            case "removeFollower":
                const removeFollowing = await this.collection.updateOne(
                    {_id: new ObjectId(profileId)},
                    {$pull: {following: data}}
                );
                const removeFollowers = await this.collection.updateOne(
                    {_id: new ObjectId(data)},
                    {$pull: {followers: profileId}}
                );
                return {removeFollowing, removeFollowers};
            case "changePrivateStatus":
                return await this.collection.updateOne(
                    {_id: new ObjectId(profileId)},
                    {$set: {isPrivate: data}}
                );
            case "editEmail":
                return await this.collection.updateOne(
                    {_id: new ObjectId(profileId)},
                    {$set: {email: data}}
                );
            default:
                throw new Error("Wrong Model Option or Model Option is Empty");
        }
    };
}

module.exports = ProfileModel;