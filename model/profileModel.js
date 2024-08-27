const {getDb} = require('../config/databaseConfig');
const {ObjectId} = require("mongodb");

exports.findProfileById = async (profileId) => {
    const db = getDb();
    return await db.collection('profile').findOne({_id: new ObjectId(profileId)});
};
exports.getProfileList = async (searchTerm) => {
    const db = getDb();
    return await db.collection('profile').find({
        $or: [
            {username: {$regex: searchTerm, $options: 'i'}},
            {profileName: {$regex: searchTerm, $options: 'i'}}
        ]
    }).toArray();

};
exports.updateProfileById = async ({profileId, option, data}) => {
    const db = getDb();
    switch (option) {
        case "editPicture":
            return await db.collection('profile').updateOne(
                {_id: new ObjectId(profileId)},
                {$set: {profileImage: data}},
            );
        case "deletePicture":
            return await db.collection('profile').updateOne(
                {_id: new ObjectId(profileId)},
                {$set: {profileImage: null}}
            );
        case "editDescription":
            return await db.collection('profile').updateOne(
                {_id: new ObjectId(profileId)},
                {$set: {"profileInfo.profileDescription": data}}
            );
        case "editLinks":
            return await db.collection('profile').updateOne(
                {_id: new ObjectId(profileId)},
                {$set: {"profileInfo.profileLinks": data}}
            );
        case "addFollower":
            const addFollowing = await db.collection('profile').updateOne(
                {_id: new ObjectId(profileId)},
                {$push: {following: data}}
            );
            const addFollowers = await db.collection('profile').updateOne(
                {_id: new ObjectId(data)},
                {$push: {followers: profileId}}
            );
            return {addFollowing, addFollowers};
        case "removeFollower":
            const removeFollowing = await db.collection('profile').updateOne(
                {_id: new ObjectId(profileId)},
                {$pull: {following: data}}
            );
            const removeFollowers = await db.collection('profile').updateOne(
                {_id: new ObjectId(data)},
                {$pull: {followers: profileId}}
            );
            return {removeFollowing, removeFollowers};
        case "changePrivateStatus":
            return await db.collection('profile').updateOne(
                {_id: new ObjectId(profileId)},
                {$set: {isPrivate: data}}
            );
        case "editEmail":
            return await db.collection('profile').updateOne(
                {_id: new ObjectId(profileId)},
                {$set: {email: data}}
            );
        default:
            return new Error("Wrong Model Option or Model Option is Empty");
    }
};