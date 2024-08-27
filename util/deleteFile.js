const path = require('path')
const fs = require('fs');

const deleteFile = (profile) => {
    if (profile.profileImage) {
        const filePath = path.join(__dirname, '..', profile.profileImage);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        return true;
    } else return false;
};

module.exports = deleteFile;