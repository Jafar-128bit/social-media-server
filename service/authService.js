// services/authService.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findProfileByUsername, createProfile } = require('../model/authModel');

exports.signIn = async ({ username, password }) => {
    const profile = await findProfileByUsername(username);
    if (!profile) throw new Error('Username not found');

    const isPasswordValid = await bcrypt.compare(password, profile.password);
    if (!isPasswordValid) throw new Error('Invalid password');

    const token = jwt.sign(
        { profileId: profile._id, username: profile.username },
        "tempkeyfornow123",
        { expiresIn: '24h' }
    );

    return { token };
};

exports.signUp = async ({ firstName, lastName, username, password, email, profileDescription }) => {
    const profileName = `${firstName} ${lastName}`;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newProfile = {
        profileName,
        username,
        profileInfo: {
            profileDescription,
            profileLinks: [],
        },
        profileImage: null,
        followers: [],
        following: [],
        isPrivate: false,
        isActive: true,
        isVerified: false,
        password: hashedPassword,
        email,
    };

    return await createProfile(newProfile);
};
